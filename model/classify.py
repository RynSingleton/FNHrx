#load keras best model\
from keras.models import load_model

model = load_model('model.keras')

#load test data
test_data = pd.read_csv('data.csv')

#preprocess test data
test_data = test_data.iloc[:, :-1].values
test_data = scaler.transform(test_data) 

#reshape test data
test_data = test_data.reshape(-1, 5000, 23)

#predict test data
predictions = model.predict(test_data)  

#save predictions
np.savetxt('predictions.txt', predictions, delimiter=',')