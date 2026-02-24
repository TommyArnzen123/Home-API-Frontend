import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HOME_SCREEN_INFO_ERROR } from './captive-error-constants';

@Component({
  selector: 'captive-error',
  imports: [],
  templateUrl: './captive-error.html',
  styleUrl: './captive-error.scss',
})
export class CaptiveError implements OnInit {
  homeScreenInfoError: string | null = null;

  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.homeScreenInfoError =
      this.activatedRoute.snapshot.queryParamMap.get(HOME_SCREEN_INFO_ERROR);
  }
}
