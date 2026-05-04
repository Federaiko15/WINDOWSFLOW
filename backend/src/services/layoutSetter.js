import { exec } from "child_process";

const LAYOUT_NAMES = {
  "0410:00000410": "Italiano",
  "0410:00020409": "Italiano - Americano Internazionale",
  "0409:00000409": "Inglese US",
  "0809:00000809": "Inglese UK",
  "040C:0000040C": "Francese",
  "0407:00000407": "Tedesco",
};

const getInstalledLayout = () => {
  return new Promise((resolve, reject) => {
    exec(
      `powershell -Command "Get-WinUserLanguageList | ForEach-Object { $_.InputMethodTips }"`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        const layouts = stdout
          .trim()
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l !== "")
          .map((id) => ({
            id, // "0410:00000410"
            name: LAYOUT_NAMES[id] || id, // "Italiano"
          }));

        resolve(layouts);
      },
    );
  });
};

const setLayout = (layoutId) => {
  const [languageCode, inputMethod] = layoutId.split(":");

  return new Promise((resolve, reject) => {
    exec(
      `powershell -Command "
        $list = Get-WinUserLanguageList;
        $list[0].InputMethodTips.Clear();
        $list[0].InputMethodTips.Add('${languageCode}:${inputMethod}');
        Set-WinUserLanguageList $list -Force
      "`,
      (error, stdout, stderr) => {
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);
        if (error) {
          reject(error);
          return;
        }
        resolve();
      },
    );
  });
};

export { setLayout, getInstalledLayout };
