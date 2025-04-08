import { Address } from '..';

export type Roles = 'ANCHOR_INVESTOR' | 'ADMIN' | 'LSD_ADMIN';

export type User = {
  _id: string;
  email: string;
  role: Roles;
  wallet_address: Address;
};

export interface AnchorUserProps {
  name: string;
  email: string;
  wallet_address: string;
  password: string;
  confirm_password: string;
  role: string;
  address: string;
  phone_number: string;
  anchor_address: string;
}

export interface LoginDataProps {
  email: string;
  password: string;
}

export interface ChangePasswordAPIProps {
  old_password: string;
  new_password: string;
  confirm_password: string;
}
