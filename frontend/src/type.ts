export interface Device {
  name: string;
  idVendor: string;
  idProduct: string;
  isAttached: boolean;
  type: string;
}

export interface Profile {
  profile_name: string;
  theme: string;
  active: boolean;
  devices: Device[];
}

export interface ApiGetProfiles {
  message: string;
  data: Profile[];
}
