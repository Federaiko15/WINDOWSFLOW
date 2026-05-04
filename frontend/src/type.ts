export interface Device {
  name: string;
  idVendor: number;
  idProduct: number;
  isAttached: boolean;
  type: string;
  layout: string | undefined;
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

export interface Layouts {
  id: string;
  name: string;
}

export interface ChangeLayoutResponse {
  idVendor: number;
  idProduct: number;
  selectedLayout: string;
  profileName: string;
}
