import { Profile } from './profile.model';

export class Comment {
  id: number;
  body: string;
  createdAt: string;
  author: Profile;
}
