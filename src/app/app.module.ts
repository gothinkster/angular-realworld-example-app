import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { EditorModule } from './editor/editor.module';
import { HomeModule } from './home/home.module';
import { ProfileModule } from './profile/profile.module';
import { SettingsModule } from './settings/settings.module';
import {
  ApiService,
  ArticlesService,
  AuthGuard,
  CommentsService,
  FooterComponent,
  HeaderComponent,
  JwtService,
  ProfilesService,
  SharedModule,
  TagsService,
  UserService,
  HttpTokenInterceptor
} from './shared';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([]);

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    ArticleModule,
    AuthModule,
    EditorModule,
    HomeModule,
    ProfileModule,
    rootRouting,
    SharedModule,
    SettingsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true},
    ApiService,
    ArticlesService,
    AuthGuard,
    CommentsService,
    JwtService,
    ProfilesService,
    TagsService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
