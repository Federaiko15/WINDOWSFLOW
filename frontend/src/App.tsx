import { useState } from "react";
import ProfileCard from "./components/Profile";
import type { Profile } from "./type.ts";

interface ApiGetProfiles {
  message: string;
  data: Profile[];
}

function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profileName, setProfileName] = useState("");
  const [theme, setTheme] = useState("");

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
    console.log(profileName, theme);
    if (!profileName || !theme) {
      alert("Prima devi aggiungere i campi richiesti");
      return;
    }
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
            theme: theme,
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

  return (
    <>
      <div className="principal-container">
        <button onClick={getProfiles} className="get_profile_button">
          Get Profiles
        </button>

        <form onSubmit={createProfile} className="create_profile_form">
          <input
            type="text"
            placeholder="Profile Name (Home)"
            onChange={onChangeProfileName}
          />
          <input
            type="text"
            placeholder="Theme (Dark/Light)"
            onChange={onChangeTheme}
          />
          <button type="submit" className="create_profile_button">
            Create Profile
          </button>
        </form>

        <ul className="profile_list">
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <ProfileCard profile={profile} key={profile.profile_name} />
            ))
          ) : (
            <li>No profiles found</li>
          )}
        </ul>
      </div>
    </>
  );
}

export default App;
