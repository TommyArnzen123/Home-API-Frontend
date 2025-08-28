import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { LoginService } from '../services/login.service';
import { Subscription } from 'rxjs';
import { ILoginResponse } from '../model/login.interface';

@Component({
  selector: 'home-header',
  imports: [MatButton],
  templateUrl: './home-header.html',
  styleUrl: './home-header.scss',
})
export class HomeHeader implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  loginStatus = false;

  constructor(private readonly loginService: LoginService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.loginService.getUserLoginInfo().subscribe({
        next: (loginInfo: ILoginResponse) => {
          if (loginInfo.jwtToken) {
            this.loginStatus = true;
          } else {
            this.loginStatus = false;
          }
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  logout() {
    this.loginService.logout();
  }
}
