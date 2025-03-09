# Define variables
BINARY_NAME=mash-notes-back
BUILD_OUTPUT=./$(BINARY_NAME)
TARGET_PATH=../frontend/src-tauri/binaries/$(BINARY_NAME)-x86_64-unknown-linux-gnu

# Default target
all: build copy

# Build the Go project
build:
	@echo "Building Go project..."
	go build -o $(BUILD_OUTPUT) .

# Copy the binary to the target path
copy: build
	@echo "Copying binary to $(TARGET_PATH)..."
	cp $(BUILD_OUTPUT) $(TARGET_PATH)

# Clean build output
clean:
	@echo "Cleaning build output..."
	rm -f $(BUILD_OUTPUT)

# Phony targets
.PHONY: all build copy clean
