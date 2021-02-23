import { Profile } from './profile.model';

export interface Comment {
  id: number;
  body: string;
  createdAt: string;
  author: Profile;
}
