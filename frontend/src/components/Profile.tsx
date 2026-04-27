import type { Profile, Device } from "../type.ts";

export default function Profile({ profile }: { profile: Profile }) {
  return (
    <li className="profile">
      <h2 className="profile_name">{profile.profile_name}</h2>

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
