# WindowsFlow 🚀

**WindowsFlow** is a modern Windows automation utility designed to streamline your workspace. It automatically manages system themes, keyboard layouts, and custom settings based on your activity or the peripherals you connect.

---

## ✨ Key Features

- **Custom Profiles:** Create tailored environments like "Home", "Office", or "Gaming".
- **Theme Automation:**
  - **Static:** Force Light or Dark mode.
  - **Dynamic:** Automatically switch themes at specific times (e.g., Light during the day, Dark at night).
- **USB Peripheral Tracking:** Link hardware to software. Automatically trigger a profile when you plug in a specific keyboard, mouse, or USB device.
- **Keyboard Layout Management:** Seamlessly switch layouts based on your active profile.

---

## 💻 Tech Stack

WindowsFlow is built using a modern, robust architecture to ensure performance and cross-process stability:

| Layer        | Technology                                                                    |
| :----------- | :---------------------------------------------------------------------------- |
| **Frontend** | [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) |
| **Backend**  | [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)            |
| **Shell**    | [Electron](https://www.electronjs.org/)                                       |

> The application leverages **TypeScript** for a type-safe UI, while **Express** manages the backend logic and system-level communications, all bundled within **Electron** for a native desktop experience.

---

## 📽️ Visual Guide

### 1. Creating a New Profile

Set up a profile in seconds by defining its name and base theme settings.

<video src="https://github.com/Federaiko15/WINDOWSFLOW/trees/main/assets/profile-creation.mp4" width="100%" autoplay loop muted playsinline></video>

### 2. Setting up Dynamic Themes

Schedule your system's appearance to change automatically throughout the day.

<video src="https://github.com/Federaiko15/WINDOWSFLOW/main/trees/assets/change-theme.mp4" width="100%" autoplay loop muted playsinline></video>

### 3. Adding USB Peripherals

Make your profiles "hardware-aware" by linking them to specific USB devices.

<video src="https://github.com/Federaiko15/WINDOWSFLOW/trees/main/assets/usb-watcher.mp4" width="100%" autoplay loop muted playsinline></video>

### 4. Profile Management & Editing

Easily toggle between active profiles or modify existing settings on the fly.

<video src="https://github.com/Federaiko15/WINDOWSFLOW/trees/main/assets/change-profile-status.mp4" width="100%" autoplay loop muted playsinline></video>

---

## 🛠️ Installation & Setup

### For Users

1. Go to the **Releases** section.
2. Download the latest `WindowFlow.zip`.
3. Extract and run `WindowFlow.exe`.

### For Developers (Local Setup)

1. Clone the repository: `git clone https://github.com/yourusername/windowflow.git`
2. Install dependencies: `npm install`
3. Run the application: `npm start`

---

## 🤝 Contributing

If you have ideas for new automation gestures or features, feel free to open an **Issue** or submit a **Pull Request**.

---

_Created with ❤️ to make Windows more adaptive._
