import { IUserProfile } from "../../user-profile/models/user-profile.model";

export interface IComment {
  id: string;
  body: string;
  createdAt: string;
  author: IUserProfile;
}
