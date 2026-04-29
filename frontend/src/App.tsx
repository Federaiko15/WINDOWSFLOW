import { useState } from "react";
import ProfileCard from "./components/Profile";
import type { Profile } from "./type.ts";
import "./style/App.css";

interface ApiGetProfiles {
  message: string;
  data: Profile[];
}

function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profileName, setProfileName] = useState("");
  const [theme, setTheme] = useState("");
  const [timeLight, setTimeLight] = useState("07:00");
  const [timeDark, setTimeDark] = useState("19:00");
  const [isDynamicTheme, setIsDynamicTheme] = useState(false);

  const getProfiles = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/flow/profiles",
        {
          method: "GET",
        },
      );
      if (!response.ok) {
        console.log("Error getting profiles response");
      }
      const result: ApiGetProfiles = await response.json();
      setProfiles(result.data);
    } catch (error) {
      console.error("Error getting profiles:", error);
    }
  };

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
        "http://localhost:4000/api/v1/flow/profiles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profile_name: profileName,
            theme: themePayload,
            active: false,
          }),
        },
      );
      if (response.ok) {
        getProfiles();
        setProfileName("");
        setTheme("");
      } else {
        console.log("Error creating profile response");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  const onChangeProfileName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileName(e.target.value);
  };

  const onChangeTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.value);
  };

  const onChangeTimeLight = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeLight(e.target.value);
  };
  const onChangeTimeDark = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeDark(e.target.value);
  };

  return (
    <>
      <div className="principal-container">
        <button onClick={getProfiles} className="get_profile_button">
          Get Profiles
        </button>

        <div className="content-split">
          <div className="left-panel">
            <ul className="profile_list">
              {profiles.length > 0 ? (
                profiles.map((profile) => (
                  <ProfileCard profile={profile} key={profile.profile_name} />
                ))
              ) : (
                <li className="no-profiles">No profiles found</li>
              )}
            </ul>
          </div>

          <div className="right-panel">
            <form onSubmit={createProfile} className="create_profile_form">
              <input
                type="text"
                placeholder="Profile Name (Home)"
                value={profileName}
                onChange={onChangeProfileName}
              />

              <div className="theme-selection">
                <label>
                  <input
                    type="radio"
                    checked={!isDynamicTheme}
                    onChange={() => setIsDynamicTheme(false)}
                  />
                  Tema Statico
                </label>
                <input
                  type="text"
                  placeholder="Theme (Dark/Light)"
                  value={theme}
                  onChange={onChangeTheme}
                  disabled={isDynamicTheme}
                />
              </div>

              <div className="theme-selection">
                <label>
                  <input
                    type="radio"
                    checked={isDynamicTheme}
                    onChange={() => setIsDynamicTheme(true)}
                  />
                  Tema Dinamico
                </label>
                <input
                  type="time"
                  value={timeLight}
                  onChange={onChangeTimeLight}
                  disabled={!isDynamicTheme}
                />
                <input
                  type="time"
                  value={timeDark}
                  onChange={onChangeTimeDark}
                  disabled={!isDynamicTheme}
                />
              </div>

              <button type="submit" className="create_profile_button">
                Create Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
