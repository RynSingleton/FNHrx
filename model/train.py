import tensorflow as tf

import os

import numpy as np

import keras
from keras import layers
from keras import ops
from keras import Sequential
from keras.layers import Conv1D, MaxPooling1D, Dense, Flatten, Dropout, BatchNormalization
from keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint

import pandas as pd

from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

import matplotlib.pyplot as plt

#preprocess data
selected_columns = ['# FP1-F7', 'F7-T7', 'T7-P7', 'P7-O1', 
                     'FP1-F3', 'F3-C3', 'C3-P3', 'P3-O1', 
                     'FP2-F4', 'F4-C4', 'C4-P4', 'P4-O2', 
                     'FP2-F8', 'F8-T8', 'T8-P8-0', 'P8-O2', 
                     'FZ-CZ', 'CZ-PZ', 'P7-T7', 'T7-FT9', 
                     'FT9-FT10', 'FT10-T8', 'T8-P8-1']

def load_and_label(folder_path, label):
    file_paths = [os.path.join(folder_path, file) for file in os.listdir(folder_path) if file.endswith('.csv')]
    data = []
    
    for file_path in file_paths:
        # Load only first 3000 timesteps and 23 channels
        print(file_path)
        df = pd.read_csv(file_path, nrows=3000, usecols=selected_columns)
        df['label'] = label
        data.append(df)
    
    return pd.concat(data, ignore_index=True)


# Load seizure and no seizure data
seizure_data = load_and_label(r'C:\Users\kamry\rhx25\model\data\patientnumber_filenumber_seizureORnoseizure\sez', 1)
no_seizure_data = load_and_label(r'C:\Users\kamry\rhx25\model\data\patientnumber_filenumber_seizureORnoseizure\nosez', 0)

# Combine and shuffle
data = pd.concat([seizure_data, no_seizure_data], ignore_index=True).sample(frac=1, random_state=42)

# Extract features and labels
X = data.iloc[:, :-1].values
y = data['label'].values

print(f"Data shape: {X.shape}, Labels shape: {y.shape}")

# Normalize data using StandardScaler
scaler = StandardScaler()
X = scaler.fit_transform(X)

# Assuming each sample has multiple channels (23 channels)
n_channels = 23
n_timesteps = 5000

# Ensure that X has a number of samples that is a multiple of 3000
# First, calculate the total number of samples in X
num_samples = X.shape[0]

# Calculate how many samples can fit into full 3000-timestep samples
num_full_samples = num_samples // n_timesteps

# Truncate the data if necessary to ensure it has a perfect multiple of 3000 timesteps
X = X[:num_full_samples * n_timesteps]
y = y[:num_full_samples * n_timesteps]  # Truncate labels to match X

# Reshape the data into (num_samples, n_timesteps, n_channels)
X = X.reshape(-1, n_timesteps, n_channels)
y = y.reshape(-1, n_timesteps)  # Reshape labels to match X structure
y = y[:, 0]  # Take only the first label from each timestep window

print(f"After truncation - X shape: {X.shape}, y shape: {y.shape}")

#split data (train/val)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#create model
print("Compiling model optimizer, loss, and metrics")
model = Sequential([
    # First Conv Block
    Conv1D(64, kernel_size=3, padding='same', activation='relu', input_shape=(n_timesteps, n_channels)),
    BatchNormalization(),
    Conv1D(64, kernel_size=3, padding='same', activation='relu'),
    BatchNormalization(),
    MaxPooling1D(pool_size=2),
    Dropout(0.2),
    
    # Second Conv Block
    Conv1D(128, kernel_size=3, padding='same', activation='relu'),
    BatchNormalization(),
    Conv1D(128, kernel_size=3, padding='same', activation='relu'),
    BatchNormalization(),
    MaxPooling1D(pool_size=2),
    Dropout(0.3),
    
    # Third Conv Block
    Conv1D(256, kernel_size=3, padding='same', activation='relu'),
    BatchNormalization(),
    Conv1D(256, kernel_size=3, padding='same', activation='relu'),
    BatchNormalization(),
    MaxPooling1D(pool_size=2),
    Dropout(0.4),
    
    # Dense layers
    Flatten(),
    Dense(256, activation='relu'),
    BatchNormalization(),
    Dropout(0.5),
    Dense(128, activation='relu'),
    BatchNormalization(),
    Dropout(0.5),
    Dense(1, activation='sigmoid')
])

# Compile with better learning rate
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Define callbacks
callbacks = [
    EarlyStopping(
        monitor='val_loss',
        patience=20,
        restore_best_weights=True,
        verbose=1
    ),
    ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.2,
        patience=10,
        min_lr=0.000001,
        verbose=1
    ),
    ModelCheckpoint(
        'best_model.keras',
        monitor='val_accuracy',
        save_best_only=True,
        mode='max',
        verbose=1
    )
]

#create fit function
print("Fit model on training data")
history = model.fit(
    X_train,
    y_train,
    batch_size=32,
    validation_split=0.2,
    epochs=100,
    callbacks=callbacks,
    verbose=1
)

# Plot training history
plt.figure(figsize=(12, 4))

# Plot training & validation accuracy
plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'])
plt.plot(history.history['val_accuracy'])
plt.title('Model Accuracy')
plt.ylabel('Accuracy')
plt.xlabel('Epoch')
plt.legend(['Train', 'Validation'], loc='upper left')

# Plot training & validation loss
plt.subplot(1, 2, 2)
plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.title('Model Loss')
plt.ylabel('Loss')
plt.xlabel('Epoch')
plt.legend(['Train', 'Validation'], loc='upper left')

plt.tight_layout()
plt.savefig('training_history.png')
plt.close()

#create testing function
print("Evaluate on test data")
results = model.evaluate(X_test, y_test, batch_size=128)
print("test loss, test acc:", results)

#save model
model.save(r'C:\Users\kamry\rhx25\model\trained\model.keras')
