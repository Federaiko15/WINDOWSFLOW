export interface Device {
  name: string;
  idVendor: string;
  idProduct: string;
  isAttached: boolean;
}

export interface Profile {
  profile_name: string;
  theme: string;
  active: boolean;
  devices: Device[];
}
