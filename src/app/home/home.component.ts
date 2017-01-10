import { Component } from '@angular/core';

import { UserService } from '../shared';

@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(
    private userService: UserService
  ) {}

}
