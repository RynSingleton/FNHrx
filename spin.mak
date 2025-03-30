# variables
NODE_VERSION := 20
PYTHON_VERSION := python3
VENV_DIR := .venv

# default target
.PHONY: all
all: node tailwindcss python-env install-python-packages

# Install Node.js and npm
.PHONY: node
node:
@echo "Checking for Node.js and npm..."
@if ! command -v node &>/dev/null; then \
echo "Node.js not found. Installing Node.js and npm..."; \
curl -fsSL https://deb.nodesource.com/setup_$(NODE_VERSION).x | sudo -E bash -; \
sudo apt-get install -y nodejs; \
else \
echo "Node.js and npm already installed."; \
fi

# Install TailwindCSS
.PHONY: tailwindcss
tailwindcss:
@echo "Installing TailwindCSS..."
@if ! command -v npx &>/dev/null; then \
echo "npm not installed. Please install Node.js and npm first."; \
exit 1; \
fi
npx tailwindcss init -p || echo "TailwindCSS already initialized."

# Set up Python virtual environment
.PHONY: python-env
python-env:
@echo "Setting up Python virtual environment..."
@if [ ! -d "$(VENV_DIR)" ]; then \
$(PYTHON_VERSION) -m venv $(VENV_DIR); \
echo "Virtual environment created at $(VENV_DIR)"; \
else \
echo "Virtual environment already exists."; \
fi

# Install TensorFlow and NumPy
.PHONY: install-python-packages
install-python-packages: python-env
@echo "Activating virtual environment and installing Python packages..."
@$(VENV_DIR)/bin/pip install --upgrade pip
@$(VENV_DIR)/bin/pip install tensorflow numpy
@echo "TensorFlow and NumPy installed."

# Clean up
.PHONY: clean
clean:
@echo "Cleaning up virtual environment and node_modules..."
rm -rf $(VENV_DIR)
rm -rf node_modules
rm -f package-lock.json
rm -f tailwind.config.js
@echo "Cleanup complete."