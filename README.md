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

   <img src="images/APK_QR.png" alt="Download APK" width="200" />

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

## 🧪 Running Maestro UI Tests

Follow these step-by-step instructions to run Maestro UI tests on your Android device:

### 1. Install Maestro

Download and install Maestro by following the official guide:  
[https://docs.maestro.dev/getting-started/installing-maestro](https://docs.maestro.dev/getting-started/installing-maestro)

If you are using **Windows**, follow the specific instructions here:  
[https://docs.maestro.dev/getting-started/installing-maestro/windows](https://docs.maestro.dev/getting-started/installing-maestro/windows)

### 2. Install Android Platform Tools

- Download the Android Platform Tools (which includes `adb`) from:  
  [https://developer.android.com/studio/releases/platform-tools](https://developer.android.com/studio/releases/platform-tools)
- Extract the ZIP file to a folder (e.g., `C:\platform-tools`).
- Add the folder path to your system `PATH` environment variable so you can use `adb` from any terminal.

### 3. Enable Developer Mode and USB Debugging on Your Phone

- Go to your phone’s **Settings** → **About phone** → tap **Build number** 7 times to enable Developer Mode.
- In **Settings** → **Developer options**, enable **USB debugging**.

### 4. Connect Your Phone

- Connect your Android device to your computer with a USB cable.
- On your phone, allow USB debugging when prompted.

### 5. Verify Device Connection

- Open a new Command Prompt window.
- Run:
  ```
  adb devices
  ```
- You should see your device listed as `device`. If not, check your USB connection and ensure drivers are installed.

### 6. Install and Launch the APK

- Make sure the ShareBuy APK is installed on your device.
- Open the ShareBuy app on your phone and log in as a user or business account.
- Ensure you are on the home screen before running tests.

### 7. Run Maestro Tests

- To run a single test, use:

  ```
  maestro test .maestro/<test_name>.yml
  ```

  **Adding parameters to the test command:**  
  You can pass environment variables or Maestro options directly in the command. For example, to override a variable for a single run:

  ```
  maestro test .maestro/<test_name>.yml --env USER_EMAIL=another@example.com --env USER_PASSWORD=AnotherPass123!
  ```

  Or to generate a JUnit report for a single test:

  ```
  maestro test .maestro/<test_name>.yml --format junit --output results.xml
  ```

  > Replace `<test_name>` with the name of your test file.

- To run all tests in a specific order and collect results in one report, use the master flow file:

  ```
  maestro test .maestro/RunTests.yml --format junit --output results.xml
  ```

  > This will execute all flows in the order defined in `RunTests.yml` and generate a single `results.xml` report.

### 📄 Saving and Viewing Test Results

By default, Maestro prints test results in the terminal.  
If you want to save the results to a file (for example, to view them in VS Code or use them in CI):

- Use the `--format junit --output results.xml` flags to generate a JUnit XML report:

  ```
  maestro test .maestro/<test name> --format junit --output results.xml
  ```

- This will create a `results.xml` file in your project directory.
- You can open `results.xml` in VS Code to view the test results in a structured format.

#### 🔄 Convert XML Results to HTML Report

To view your test results in a graphical HTML report:

1. **Install the xunit-viewer tool globally (recommended replacement for junit-viewer):**
   ```
   npm install -g xunit-viewer
   ```
2. **Convert your XML results to HTML:**
   ```
   npx junit-viewer --results=results.xml --save=report.html
   ```
3. **Open `report.html` in your browser for a graphical view.**

   - You can also use the [Live Preview](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server) extension in VS Code to view the HTML file inside the editor.

     To view the file after installing the extenstion, right click the html file and select `Show Preview` option.

---

**Troubleshooting Tips:**

- If your device is not detected, try reconnecting the USB cable, restarting your phone, or restarting `adb` with:
  ```
  adb kill-server
  adb start-server
  ```
- Make sure only one device is connected to avoid conflicts.
- If you encounter issues, refer to the [Maestro documentation](https://docs.maestro.dev/) or ask your team for help.
