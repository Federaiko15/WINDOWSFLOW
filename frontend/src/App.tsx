import { useState } from "react";
import ProfileCard from "./components/Profile";
import type { Profile } from "./type.ts";

interface ApiGetProfiles {
  message: string;
  data: Profile[];
}

function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

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

  return (
    <>
      <div className="principal-container">
        <button onClick={getProfiles} className="get_profile_button">
          Get Profiles
        </button>
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
