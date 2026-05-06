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
      `powershell -Command "$ProgressPreference = 'SilentlyContinue'; Get-WinUserLanguageList | ForEach-Object { $_.InputMethodTips }"`,
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
            id,
            name: LAYOUT_NAMES[id] || id,
          }));
        resolve(layouts);
      },
    );
  });
};

const setLayout = (layoutId) => {
  return new Promise((resolve, reject) => {
    const psCommand = `
      $ProgressPreference = 'SilentlyContinue'
      Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class KBFinal { [DllImport("user32.dll")] public static extern IntPtr GetKeyboardLayout(uint idThread); [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, IntPtr lpdwProcessId); [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow(); [DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo); }'
      
      # Prendi il layout corrente e convertilo in esadecimale a 8 caratteri
      $hwnd = [KBFinal]::GetForegroundWindow()
      $threadId = [KBFinal]::GetWindowThreadProcessId($hwnd, [IntPtr]::Zero)
      $currentHkl = [KBFinal]::GetKeyboardLayout($threadId)
      $currentHex = $currentHkl.ToInt64().ToString('X8').Substring([Math]::Max(0, $currentHkl.ToInt64().ToString('X').Length - 8))
      
      # Mappa esadecimale -> layoutId
      $hklMap = @{
        '04100410' = '0410:00000410'
        'F0010410' = '0410:00020409'
      }
      
      $layouts = Get-WinUserLanguageList | ForEach-Object { $_.InputMethodTips }
      $totalLayouts = $layouts.Count
      $targetId = '${layoutId}'
      $currentId = $hklMap[$currentHex]
      
      $currentIndex = 0
      $targetIndex = 0
      for ($i = 0; $i -lt $totalLayouts; $i++) {
        if ($layouts[$i] -eq $currentId) { $currentIndex = $i }
        if ($layouts[$i] -eq $targetId) { $targetIndex = $i }
      }
      
      $presses = ($targetIndex - $currentIndex + $totalLayouts) % $totalLayouts
      
      if ($presses -gt 0) {
        [KBFinal]::keybd_event(0x5B, 0, 0, 0)
        for ($i = 0; $i -lt $presses; $i++) {
          [KBFinal]::keybd_event(0x20, 0, 0, 0)
          Start-Sleep -Milliseconds 200
          [KBFinal]::keybd_event(0x20, 0, 2, 0)
          Start-Sleep -Milliseconds 200
        }
        [KBFinal]::keybd_event(0x5B, 0, 2, 0)
      }
    `;

    const encodedCommand = Buffer.from(psCommand, "utf16le").toString("base64");
    exec(
      `powershell -EncodedCommand ${encodedCommand}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error("stdout:", stdout);
          console.error("stderr:", stderr);
          reject(error);
          return;
        }
        resolve();
      },
    );
  });
};

export { setLayout, getInstalledLayout };
