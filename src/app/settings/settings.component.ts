import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User, UserService } from '../shared';

@Component({
  selector: 'settings-page',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  user: User = new User();
  errors: Object = {};
  isSubmitting: boolean = false;

  ngOnInit() {
    // Make a fresh copy of the current user's object to place in editable form fields
    (<any>Object).assign(this.user, this.userService.getCurrentUser());
  }

  submitForm() {
    this.userService
    .update(this.user)
    .subscribe(
      updatedUser => this.router.navigateByUrl('/profile/' + updatedUser.username),
      err => {
        this.errors = err;
        this.isSubmitting = false;
      }
    );
  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl('/');
  }
}
