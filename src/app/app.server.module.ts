import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { WINDOW } from './core/models/injectable-tokens';
import { windowFactory } from './global-factories.server';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
  ],
  providers: [{provide: WINDOW, useFactory: windowFactory}],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
