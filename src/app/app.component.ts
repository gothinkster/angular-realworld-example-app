import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { UserService } from "./core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.populate();
  }
}
