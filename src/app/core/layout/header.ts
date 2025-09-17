import { Component, inject } from "@angular/core";
import { UserService } from "../auth/services/user.service";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe } from "@angular/common";
import { IfAuthenticated } from "../auth/if-authenticated";

@Component({
  selector: "app-layout-header",
  templateUrl: "./header.html",
  imports: [RouterLinkActive, RouterLink, AsyncPipe, IfAuthenticated],
})
export class Header {
  currentUser$ = inject(UserService).currentUser;
}
