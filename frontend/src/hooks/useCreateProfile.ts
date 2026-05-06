import { useState } from "react";

export function useCreateProfile(onSuccess: () => void) {
  const [profileName, setProfileName] = useState("");
  const [theme, setTheme] = useState("");
  const [timeLight, setTimeLight] = useState("07:00");
  const [timeDark, setTimeDark] = useState("19:00");
  const [isDynamicTheme, setIsDynamicTheme] = useState(false);

  const onChangeProfileName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfileName(e.target.value);
  const onChangeTheme = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTheme(e.target.value);
  const onChangeTimeLight = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTimeLight(e.target.value);
  const onChangeTimeDark = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTimeDark(e.target.value);

  const createProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profileName) {
      alert("Prima devi aggiungere il nome del profilo");
      return;
    }
    if (!isDynamicTheme && !theme) {
      alert("Devi inserire un tema (Dark/Light)");
      return;
    }
    if (isDynamicTheme && (!timeLight || !timeDark)) {
      alert("Devi inserire entrambi gli orari per il tema dinamico");
      return;
    }

    const themePayload = isDynamicTheme
      ? { startLight: timeLight, startDark: timeDark }
      : theme;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/flow/profiles`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile_name: profileName,
            theme: themePayload,
            active: false,
          }),
        },
      );

      if (response.ok) {
        onSuccess(); // Forza l'aggiornamento della UI chiamando getProfiles()
        setProfileName("");
        setTheme("");
      } else {
        console.log("Error creating profile response");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  return {
    profileName,
    theme,
    timeLight,
    timeDark,
    isDynamicTheme,
    setIsDynamicTheme,
    createProfile,
    onChangeProfileName,
    onChangeTheme,
    onChangeTimeLight,
    onChangeTimeDark,
  };
}
