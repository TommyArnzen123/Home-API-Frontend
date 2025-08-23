import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionStorageService } from '../services/session-storage.service';
import { JWT_TOKEN } from '../constants/session-storage-constants';
import { Router } from '@angular/router';
import { APP_ROOT_ROUTE } from '../constants/navigation-constants';
import { MatButton } from '@angular/material/button';
import { LoginService } from '../services/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'home-header',
  imports: [MatButton],
  templateUrl: './home-header.html',
  styleUrl: './home-header.scss',
})
export class HomeHeader implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  loginStatus = false;

  constructor(
    private readonly sessionStorageService: SessionStorageService,
    private readonly router: Router,
    private readonly loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.loginService.getLoginStatus().subscribe({
        next: (isLoggedIn: boolean) => {
          this.loginStatus = isLoggedIn;
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  logout() {
    this.loginService.updateLoginStatus(false);
    this.sessionStorageService.removeItem(JWT_TOKEN);
    this.router.navigateByUrl(APP_ROOT_ROUTE);
  }
}
