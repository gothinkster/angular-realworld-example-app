import { Profile } from "./profile.model";

export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  author: Profile;
}
