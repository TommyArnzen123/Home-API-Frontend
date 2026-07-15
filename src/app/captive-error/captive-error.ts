import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { LoginService } from '../services/login';
import { HOME_SCREEN_INFO_ERROR, SESSION_TIMEOUT_ERROR } from './captive-error-constants';
import { IconElement } from '../shared/components/icon-element/icon-element';

@Component({
  selector: 'captive-error',
  imports: [MatCardModule, IconElement],
  templateUrl: './captive-error.html',
  styleUrl: './captive-error.scss',
})
export class CaptiveError implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly loginService = inject(LoginService);

  protected homescreenInfoError: string | null = null;
  protected sessionTimeoutError: string | null = null;

  ngOnInit(): void {
    // Log the user out of the application.
    this.loginService.logoutWithoutRoute();

    this.homescreenInfoError =
      this.activatedRoute.snapshot.queryParamMap.get(HOME_SCREEN_INFO_ERROR);
    this.sessionTimeoutError =
      this.activatedRoute.snapshot.queryParamMap.get(SESSION_TIMEOUT_ERROR);
  }
}
