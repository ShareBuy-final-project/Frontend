# ShareBuy Frontend

This project is the frontend for the ShareBuy application, built using React Native to deliver a seamless cross-platform experience.

## 🚀 Run locally

1. Install dependencies:

   ```sh
   npm install
   ```

2. Start the development server:

   ```sh
   npx expo start
   ```

3. If the default port is unavailable, you can specify a different port:

   ```sh
   npx expo start --port 8083
   ```

4. Open the Expo Developer Tools in your browser and follow the instructions to run the app on your device or emulator.

### 📱 Connecting with the Expo App

1. Download the Expo Go app from the [App Store](https://apps.apple.com/) or [Google Play](https://play.google.com/).
2. Scan the QR code displayed in the Expo Developer Tools or terminal using the Expo Go app.
3. The app will load on your phone, allowing you to test and interact with the project.

## 📦 Building APK and Running in Production
   To run the app on any Android device without relying on the Expo Go app or development server, you need to generate a standalone APK that can be installed and executed on all Android devices.

1. Switch to the `build-apk` branch:
   ```sh
   git checkout build-apk
   ```
2. Merge the `main` branch into the current branch to incorporate the latest changes:
   ```sh
   git merge main
   ```
3. Navigate to the `android` folder:
   ```sh
   cd android
   ```

4. Clean the build directory:
   ```sh
   ./gradlew clean
   ```

5. Build the APK using the following command:
   ```sh
   ./gradlew assembleRelease
   ```

6. Once the build is complete, the APK will be located at:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```
7. Navigate to the project folder on Google Drive, locate the ShareBuy APK file, right-click on it, and select **Details**. Under **Version Management**, choose **Upload New Version** and upload your newly built APK file.

You can download the APK from the link below:

   <img src="assets/images/APK_QR.png" alt="Download APK" width="200" />


## 🛠️ Technologies Used

- **Programming Languages**: JavaScript
- **Framework**: React Native
- **Development Tools**: Expo CLI

## 📝 Notes

- Ensure your phone and development machine are on the same network for the Expo Go app to connect successfully.
- If you encounter issues, try restarting the development server or clearing the cache:
  ```sh
  npx expo start --clear
  ```

## 📂 Project Structure

- `app/`: Contains the screens and navigation structure for the app.
- `assets/`: Stores static assets like images and fonts.
- `components/`: Reusable UI components.

## Run Maestro Tests:
- Download Maestro
- Launch the apk
- For tests that test the UI, login as a user/business account
- type the command: maestro test .maestro/{test name}.yml