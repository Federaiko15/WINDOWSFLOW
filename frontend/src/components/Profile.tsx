import type { Profile, Device } from "../type.ts";
import { useSocket } from "../SocketContext.tsx";

export default function Profile({ profile }: { profile: Profile }) {
  // thanks to the Context feature i can access the socket created in SocketContext.tsx
  const { addDevice } = useSocket();

  const handleAddDevice = () => {
    addDevice(profile.profile_name);
  };

  const handleDeleteProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/flow/profiles/${profile.profile_name}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        console.log("Error deleting profile");
      } else {
        console.log("Profile deleted");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <li className="profile">
      <h2 className="profile_name">{profile.profile_name}</h2>
      <button onClick={handleDeleteProfile}>Elimina Profilo</button>
      <button onClick={handleAddDevice}>Aggiungi Periferica</button>

      <ul className="device_list">
        {profile.devices?.map((device: Device, index: number) => (
          <li key={index} className="device_item">
            {device.name}
          </li>
        ))}
      </ul>
    </li>
  );
}
