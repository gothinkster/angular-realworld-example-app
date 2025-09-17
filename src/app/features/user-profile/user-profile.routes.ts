import { Routes } from "@angular/router";
import { UserProfile } from "./pages/user-profile/user-profile";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: ":username",
        component: UserProfile,
        children: [
          {
            path: "",
            loadComponent: () => import("./components/user-profile-articles"),
          },
          {
            path: "favorites",
            loadComponent: () => import("./components/user-profile-favorites"),
          },
        ],
      },
    ],
  },
];

export default routes;
