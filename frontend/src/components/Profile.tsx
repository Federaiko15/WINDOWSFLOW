import { useState } from "react";
import type { Profile, Device, DinamicTheme } from "../type.ts";
import "../style/Profile.css";
import DeviceDetailsModal from "./DeviceDetailsModal";
import { useProfileActions } from "../hooks/useProfileActions.ts";
import { useSocket } from "../SocketContext";

export default function Profile({ profile }: { profile: Profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [wantDeleteProfile, setWantDeleteProfile] = useState<boolean>(false);
  const [isEditingTheme, setIsEditingTheme] = useState<boolean>(false);

  // State for the theme editor
  const [isDynamicTheme, setIsDynamicTheme] = useState(false);
  const [theme, setTheme] = useState("");
  const [timeLight, setTimeLight] = useState("07:00");
  const [timeDark, setTimeDark] = useState("19:00");

  const { profiles, getProfiles } = useSocket();

  // Usiamo il nostro Custom Hook
  const {
    toggleActive,
    deleteDevice,
    deleteProfile,
    addDevice,
    changeProfileTheme,
  } = useProfileActions(profile.profile_name, profile.active);

  const handleOpenEditTheme = () => {
    const isDynamic = typeof profile.theme !== "string";
    setIsDynamicTheme(isDynamic);

    if (isDynamic) {
      const dynamicTheme = profile.theme as unknown as DinamicTheme;
      setTimeLight(dynamicTheme.startLight || "07:00");
      setTimeDark(dynamicTheme.startDark || "19:00");
      setTheme("");
    } else {
      setTheme(profile.theme as string);
      setTimeLight("07:00");
      setTimeDark("19:00");
    }

    setIsEditingTheme(true);
  };

  const handleToggleActive = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Evita di aprire/chiudere i dettagli del profilo al click

    try {
      if (!profile.active) {
        // Se stiamo per accendere questo, troviamo e spegniamo l'eventuale altro profilo acceso
        const currentlyActive = profiles.find(
          (p) => p.active && p.profile_name !== profile.profile_name,
        );
        if (currentlyActive) {
          await fetch(
            `${import.meta.env.VITE_SERVER_URL}/api/v1/flow/profiles/${currentlyActive.profile_name}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ active: false }),
            },
          );
        }
      }

      await toggleActive();
      getProfiles(); // Sincronizza lo stato di tutte le ProfileCard nell'interfaccia
    } catch (error) {
      console.error("Errore durante l'attivazione del profilo:", error);
    }
  };

  return (
    <li className="profile_card">
      <div className="profile_header" onClick={() => setIsOpen(!isOpen)}>
        <h2 className="profile_name">{profile.profile_name}</h2>
        <span className="toggle_icon">{isOpen ? "▲" : "▼"}</span>
        <button
          className={`toggle_switch ${profile.active ? "on" : "off"}`}
          onClick={handleToggleActive}
        >
          <span className="toggle_slider"></span>
        </button>
      </div>

      {isOpen && (
        <div className="profile_details">
          <p className="current_theme">
            Theme:{" "}
            {typeof profile.theme === "string"
              ? profile.theme
              : `Dinamico (Chiaro: ${(profile.theme as DinamicTheme)?.startLight}, Scuro: ${(profile.theme as DinamicTheme)?.startDark})`}
          </p>
          <p className="active_status">
            Attivo: {profile.active ? "Sì" : "No"}
          </p>
          <div className="profile_actions">
            <button
              className="btn_delete_profile"
              onClick={() => setWantDeleteProfile(true)}
            >
              Elimina
            </button>
            <button className="btn_add_device" onClick={handleOpenEditTheme}>
              Modifica Tema
            </button>
            <button className="btn_add_device" onClick={addDevice}>
              + Periferica
            </button>
          </div>

          <ul className="device_list">
            {profile.devices?.map((device: Device, index: number) => (
              <li
                key={index}
                className="device_item"
                onClick={() => setSelectedDevice(device)}
              >
                <span className="device_info">
                  {device.name} <small>({device.type})</small>
                </span>
                <button
                  className="btn_delete_device"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDevice(device);
                  }}
                >
                  Rimuovi
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedDevice && (
        <DeviceDetailsModal
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
          profileName={profile.profile_name}
        />
      )}

      {wantDeleteProfile && (
        <div className="delete_profile_overlay">
          <div className="delete_profile_modal">
            <h3 className="delete_profile_title">
              Sei sicuro di voler eliminare il profilo?
            </h3>
            <div className="delete_profile_buttons">
              <button
                className="btn_delete_profile_confirm"
                onClick={deleteProfile}
              >
                Elimina
              </button>
              <button
                className="btn_cancel_delete"
                onClick={() => setWantDeleteProfile(false)}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingTheme && (
        <div className="edit_theme_overlay">
          <div className="edit_theme_modal">
            <h3>Modifica Tema</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsEditingTheme(false);
                changeProfileTheme(
                  isDynamicTheme
                    ? { startLight: timeLight, startDark: timeDark }
                    : theme,
                );
              }}
              className="edit_theme_form"
            >
              <div className="edit_theme_selection">
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
                  onChange={(e) => setTheme(e.target.value)}
                  disabled={isDynamicTheme}
                />
              </div>

              <div className="edit_theme_selection">
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
                  onChange={(e) => setTimeLight(e.target.value)}
                  disabled={!isDynamicTheme}
                />
                <input
                  type="time"
                  value={timeDark}
                  onChange={(e) => setTimeDark(e.target.value)}
                  disabled={!isDynamicTheme}
                />
              </div>

              <div className="edit_theme_buttons">
                <button type="submit" className="btn_save_theme">
                  Salva
                </button>
                <button
                  type="button"
                  className="btn_cancel_theme"
                  onClick={() => setIsEditingTheme(false)}
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </li>
  );
}
