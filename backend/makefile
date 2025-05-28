# Detect OS and set variables
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Linux)
	OS := linux
	EXT :=
	GOOS := linux
	GOARCH := amd64
	TARGET_TRIPLE := x86_64-unknown-linux-gnu
endif

ifeq ($(OS),)
ifeq ($(findstring MINGW,$(UNAME_S)),MINGW)
	OS := windows
	EXT := .exe
	GOOS := windows
	GOARCH := amd64
	TARGET_TRIPLE := x86_64-pc-windows-msvc
endif
endif

BINARY_NAME := yana-back
BUILD_OUTPUT := ./$(BINARY_NAME)$(EXT)
TARGET_PATH := ../frontend/src-tauri/binaries/$(BINARY_NAME)-$(TARGET_TRIPLE)$(EXT)

# Default target
all: build copy clean

# Build the Go project
build:
	@echo "Building Go project for $(GOOS)/$(GOARCH)..."
	GOOS=$(GOOS) GOARCH=$(GOARCH) go build -o $(BUILD_OUTPUT) .

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
