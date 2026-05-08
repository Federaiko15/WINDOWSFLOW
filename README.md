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

![Creating a New Profile](<img width="800" height="478" alt="Image" src="https://github.com/user-attachments/assets/5c15847c-f8fd-4355-8ccc-9fcd0c81e352" />)

### 2. Setting up Dynamic Themes

Schedule your system's appearance to change automatically throughout the day.

<!-- Sostituisci con il link GitHub della tua GIF: assets/change-theme.gif -->

![Setting up Dynamic Themes](<img width="800" height="480" alt="Image" src="https://github.com/user-attachments/assets/78a1c636-ecba-4c02-b5c8-1134330260a3" />)

### 3. Adding USB Peripherals

Make your profiles "hardware-aware" by linking them to specific USB devices.

<!-- Sostituisci con il link GitHub della tua GIF: assets/usb-watcher.gif -->

![Adding USB Peripherals](<img width="800" height="478" alt="Image" src="https://github.com/user-attachments/assets/026df7a3-705a-413c-ab53-f61ffffa76f9" />)

### 4. Profile Management & Editing

Easily toggle between active profiles or modify existing settings on the fly.

<!-- Sostituisci con il link GitHub della tua GIF: assets/change-profile-status.gif -->

![Profile Management & Editing](<img width="800" height="478" alt="Image" src="https://github.com/user-attachments/assets/8476f466-2cf3-46d7-8d93-5148d483246e" />)

### 5. Deleting a Profile

Remove profiles you no longer need directly from the management panel.

<!-- Sostituisci con il link GitHub della tua GIF: assets/delete-profile.gif -->

![Deleting a Profile](<img width="800" height="479" alt="Image" src="https://github.com/user-attachments/assets/28acc62c-50a4-4b00-9fc0-82713f45ac0d" />)

---

## 🛠️ Installation & Setup

### For Users

1. Go to the [**Releases**](https://github.com/TUO_USERNAME/windowsflow/releases) section.
2. Download the latest **`WindowsFlow.Setup.1.0.0.exe`**.
3. Run the installer and follow the on-screen instructions.

### For Developers (Local Setup)

1. Clone the repository: `git clone https://github.com/TUO_USERNAME/windowsflow.git`
2. Install dependencies: `npm install`
3. Run the application: `npm start`

---

## 🤝 Contributing

If you have ideas for new automation gestures or features, feel free to open an **Issue** or submit a **Pull Request**.

---

_Created with ❤️ to make Windows more adaptive._
