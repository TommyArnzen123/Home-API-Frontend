import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { LoginService } from '../services/login.service';
import { Subscription } from 'rxjs';
import { IUser } from '../model/login.interface';

@Component({
  selector: 'home-header',
  imports: [MatButton],
  templateUrl: './home-header.html',
  styleUrl: './home-header.scss',
})
export class HomeHeader {
  subscriptions: Subscription[] = [];

  loginService = inject(LoginService);

  isLoggedIn = this.loginService.isLoggedIn;

  logout() {
    this.loginService.logout();
  }
}
