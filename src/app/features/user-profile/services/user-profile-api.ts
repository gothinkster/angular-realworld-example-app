import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { IUserProfile } from "../models/user-profile.model";

@Injectable({ providedIn: "root" })
export class UserProfileApi {
  constructor(private readonly http: HttpClient) {}

  get(username: string): Observable<IUserProfile> {
    return this.http
      .get<{ profile: IUserProfile }>("/profiles/" + username)
      .pipe(
        map((data: { profile: IUserProfile }) => data.profile),
        shareReplay(1),
      );
  }

  follow(username: string): Observable<IUserProfile> {
    return this.http
      .post<{ profile: IUserProfile }>("/profiles/" + username + "/follow", {})
      .pipe(map((data: { profile: IUserProfile }) => data.profile));
  }

  unfollow(username: string): Observable<IUserProfile> {
    return this.http
      .delete<{ profile: IUserProfile }>("/profiles/" + username + "/follow")
      .pipe(map((data: { profile: IUserProfile }) => data.profile));
  }
}
