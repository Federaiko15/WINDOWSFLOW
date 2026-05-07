export interface Device {
  name: string;
  idVendor: number;
  idProduct: number;
  isAttached: boolean;
  type: string;
  layout: string | undefined;
  isConnected: boolean;
}

export interface Profile {
  profile_name: string;
  theme: string | DinamicTheme;
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

export interface DinamicTheme {
  startLight: string;
  startDark: string;
}
