import { inject, NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { UserService } from "./core/services/user.service";
import { map } from "rxjs/operators";
import { ProfileComponent } from "./features/profile/routes/profile/profile.component";

const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./features/article/routes/home/home.component"),
  },
  {
    path: "login",
    loadComponent: () => import("./core/auth/auth.component"),
    canActivate: [
      () => inject(UserService).isAuthenticated.pipe(map((isAuth) => !isAuth)),
    ],
  },
  {
    path: "register",
    loadComponent: () => import("./core/auth/auth.component"),
    canActivate: [
      () => inject(UserService).isAuthenticated.pipe(map((isAuth) => !isAuth)),
    ],
  },
  {
    path: "settings",
    loadComponent: () => import("./features/settings/settings.component"),
    canActivate: [() => inject(UserService).isAuthenticated],
  },
  {
    path: "profile",
    children: [
      {
        path: ":username",
        component: ProfileComponent,
        children: [
          {
            path: "",
            loadComponent: () =>
              import(
                "./features/profile/components/profile-articles.component"
              ),
          },
          {
            path: "favorites",
            loadComponent: () =>
              import(
                "./features/profile/components/profile-favorites.component"
              ),
          },
        ],
      },
    ],
  },
  {
    path: "editor",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./features/article/routes/editor/editor.component"),
        canActivate: [() => inject(UserService).isAuthenticated],
      },
      {
        path: ":slug",
        loadComponent: () =>
          import("./features/article/routes/editor/editor.component"),
        canActivate: [() => inject(UserService).isAuthenticated],
      },
    ],
  },
  {
    path: "article/:slug",
    loadComponent: () =>
      import("./features/article/routes/article/article.component"),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
