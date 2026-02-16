import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HOME_SCREEN_INFO_ERROR } from './captive-error-constants';

@Component({
  selector: 'captive-error',
  imports: [],
  templateUrl: './captive-error.html',
  styleUrl: './captive-error.scss',
})
export class CaptiveError implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  homeScreenInfoError: string | null = null;

  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.homeScreenInfoError =
      this.activatedRoute.snapshot.queryParamMap.get(HOME_SCREEN_INFO_ERROR);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
