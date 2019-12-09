import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: './home/home.module#HomeModule'
      },
      {
        path: 'login',
        loadChildren: './auth/auth.module#AuthModule'
      },
      {
        path: 'register',
        loadChildren: './auth/auth.module#AuthModule'
      }
    ]
  },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule',
  },
  {
    path: 'profile',
    loadChildren: './profile/profile.module#ProfileModule',
  },
  {
    path: 'editor',
    loadChildren: './editor/editor.module#EditorModule',
  },
  {
    path: 'article',
    loadChildren: './article/article.module#ArticleModule',
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preload all modules; optionally we could
    // implement a custom preloading strategy for just some
    // of the modules (PRs welcome 😉)
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
