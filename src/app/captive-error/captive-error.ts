import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HOME_SCREEN_INFO_ERROR, SESSION_TIMEOUT_ERROR } from './captive-error-constants';
import { MatCardModule } from '@angular/material/card';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'captive-error',
  imports: [MatCardModule],
  templateUrl: './captive-error.html',
  styleUrl: './captive-error.scss',
})
export class CaptiveError implements OnInit {
  homeScreenInfoError: string | null = null;
  sessionTimeoutError: string | null = null;

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly loginService = inject(LoginService);

  ngOnInit(): void {
    // Log the user out of the application.
    this.loginService.logoutWithoutRoute();

    this.homeScreenInfoError =
      this.activatedRoute.snapshot.queryParamMap.get(HOME_SCREEN_INFO_ERROR);
    this.sessionTimeoutError =
      this.activatedRoute.snapshot.queryParamMap.get(SESSION_TIMEOUT_ERROR);
  }
}
