import { useEffect } from "react";
import ProfileCard from "./components/Profile";
import { useSocket } from "./SocketContext";
import "./style/App.css";
import { useCreateProfile } from "./hooks/useCreateProfile";

function App() {
  const { getProfiles: emitGetProfiles, profiles } = useSocket();

  const {
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
  } = useCreateProfile(emitGetProfiles);

  useEffect(() => {
    emitGetProfiles();
  }, []);

  const handleGetProfiles = async () => {
    await emitGetProfiles();
  };

  return (
    <>
      <div className="principal-container">
        <div className="app-header">
          <h1 className="app-title">WindowsFlow</h1>
          <button onClick={handleGetProfiles} className="get_profile_button">
            Get Profiles
          </button>
        </div>

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
                  Static Theme
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
                  Dinamic Theme
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

        <footer className="app-footer">
          <p>
            Created with ❤️ by Federico •{" "}
            <a
              href="https://github.com/Federaiko15/WINDOWSFLOW"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
