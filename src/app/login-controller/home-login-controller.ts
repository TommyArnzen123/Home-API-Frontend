import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../services/session-storage.service';
import { Router } from '@angular/router';
import { HOME_PAGE_ROUTE, LOGIN_ROUTE } from '../constants/navigation-constants';
import { JWT_TOKEN } from '../constants/session-storage-constants';

@Component({
  selector: 'home-login-controller',
  imports: [],
  templateUrl: './home-login-controller.html',
  styleUrl: './home-login-controller.scss',
})
export class HomeLoginController implements OnInit {
  jwtToken!: String;

  constructor(
    private readonly sessionStorageService: SessionStorageService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.jwtToken = this.sessionStorageService.getItem(JWT_TOKEN) || '';

    if (this.jwtToken === '') {
      this.router.navigateByUrl(LOGIN_ROUTE); // JWT Token not set - display login page.
    } else {
      this.router.navigateByUrl(HOME_PAGE_ROUTE); // JWT Token set - display home page.
    }
  }
}
