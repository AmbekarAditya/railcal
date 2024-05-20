
# Android Development App Setup

## Step 1: Download the Project from GitHub

1. **Clone the Repository**:
   ```sh
   git clone <repository-url>
   ```
   Replace `<repository-url>` with the URL of your GitHub repository.

2. **Navigate to the Project Directory**:
   ```sh
   cd <project-directory>
   ```
   Replace `<project-directory>` with the name of your project directory.

## Step 2: Download Android Studio and SDK

1. **Download and Install Android Studio**:
   - Download Android Studio from the [official website](https://developer.android.com/studio).
   - Follow the installation instructions for your operating system.

2. **Install Android SDK**:
   - Open Android Studio.
   - Go to `Configure` > `SDK Manager`.
   - Ensure you have the necessary SDK platforms and tools installed (e.g., Android SDK Platform, Android SDK Build-Tools, etc.).

## Step 3: Login to EAS

1. **Install EAS CLI** (if not already installed):
   ```sh
   npm install -g eas-cli
   ```

2. **Login to EAS**:
   ```sh
   eas login
   ```

## Step 4: Run `eas credentials` and Add SHA1 and SHA256 Keys to Firebase Settings

1. **Run EAS Credentials**:
   ```sh
   eas credentials
   ```

2. **Retrieve SHA1 and SHA256 Keys**:
   - Copy the SHA1 and SHA256 keys from the output.

3. **Add Keys to Firebase**:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Select your project.
   - Navigate to `Project Settings` > `General` > `Your apps` section.
   - Select your Android app and add the SHA1 and SHA256 keys under `SHA certificate fingerprints`.

## Step 5: Upload `google-services.json` File to EAS Secret

1. **Upload `google-services.json`**:
   ```sh
   eas secret:create --scope project --name GOOGLE_SERVICES_JSON --type file --value path/to/google-services.json
   ```
   Replace `path/to/google-services.json` with the actual path to your `google-services.json` file.

## Step 6: Build the Project

1. **Add Build Script to `package.json`**:
   Open your `package.json` file and add the following script:
   ```json
   "scripts": {
     "eas:build:android:dev": "eas build --platform android --profile development"
   }
   ```
(Remove the google-services.json, and firbase from .gitignore)

2. **Run the Build Script**:
   ```sh
   npm run eas:build:android:dev
   ```

## Step 7: Start the App in the Emulator

1. **Start Expo**:
   ```sh
   npm start
   ```

2. **Press 'a' to Start the App in the Emulator**:
   - After starting Expo, press `a` to open the app in the Android emulator.

