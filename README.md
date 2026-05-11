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

![Creating a New Profile](https://github.com/user-attachments/assets/9e6fccad-d21a-4b4d-88bd-4b6ecd24f82f)

### 2. Setting up Dynamic Themes

Schedule your system's appearance to change automatically throughout the day.

![Setting up Dynamic Themes](https://github.com/user-attachments/assets/78a1c636-ecba-4c02-b5c8-1134330260a3)

### 3. Adding USB Peripherals

Make your profiles "hardware-aware" by linking them to specific USB devices.

![Adding USB Peripherals](https://github.com/Federaiko15/WINDOWSFLOW/issues/3#issue-4405152407)

### 4. Profile Management & Editing

Easily toggle between active profiles or modify existing settings on the fly.

![Profile Management & Editing](https://github.com/user-attachments/assets/8476f466-2cf3-46d7-8d93-5148d483246e)

### 5. Deleting a Profile

Remove profiles you no longer need directly from the management panel.

![Deleting a Profile](https://github.com/user-attachments/assets/28acc62c-50a4-4b00-9fc0-82713f45ac0d)

---

## 🛠️ Installation & Setup

### For Users

1. Go to the [**Releases**](https://github.com/Federaiko15/WINDOWSFLOW/releases) section.
2. Download the latest **`WindowsFlow.Setup.X.X.X.exe`**.
3. Run the installer and follow the on-screen instructions.

### For Developers (Local Setup)

1. Clone the repository: `git clone https://github.com/Federaiko15/windowsflow.git`
2. Install dependencies: `npm install`
3. Run the application: `npm start`

---

## 🤝 Contributing

If you have ideas for new automation gestures or features, feel free to open an **Issue** or submit a **Pull Request**.

---
