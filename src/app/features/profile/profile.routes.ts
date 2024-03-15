import { Routes } from "@angular/router";
import { ProfileComponent } from "./pages/profile/profile.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: ":username",
        component: ProfileComponent,
        children: [
          {
            path: "",
            loadComponent: () =>
              import("./components/profile-articles.component"),
          },
          {
            path: "favorites",
            loadComponent: () =>
              import("./components/profile-favorites.component"),
          },
        ],
      },
    ],
  },
];

export default routes;
