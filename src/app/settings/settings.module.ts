import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { AuthGuard } from '../core';
import { SharedModule } from '../shared';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SettingsRoutingModule
  ],
  declarations: [
    SettingsComponent
  ]
})
export class SettingsModule {}
