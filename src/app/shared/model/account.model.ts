import {User} from './user.model';

export class AccountModel {
  id?: string;
  user?: User = new User();
  email?: string;
  password?: string;
  verified?: boolean;
  enabled?: boolean;
  locked?: boolean;
}
