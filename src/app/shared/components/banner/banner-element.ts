import { Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions } from '@angular/material/card';
import { IBanner, IBannerActions } from '../../../model/banner';

@Component({
  selector: 'banner-element',
  imports: [MatButton, MatCard, MatCardActions],
  templateUrl: './banner-element.html',
  styleUrl: './banner-element.scss',
})
export class BannerElement {
  bannerInfo = input.required<IBanner>();
  bannerActions = input<IBannerActions | undefined>(undefined);

  protected tertiaryClicked(): void {
    if (this.bannerActions()?.tertiaryAction) {
      this.bannerActions()?.tertiaryAction();
    }
  }

  protected getIconPath(): string {
    switch (this.bannerInfo().type) {
      case 'INFO':
        return 'thermometer-info-icon.svg';
      case 'SUCCESS':
        return 'thermometer-success-icon.svg';
      case 'WARNING':
        return 'thermometer-warning-icon.svg';
      case 'ALERT':
        return 'thermometer-alert-icon.svg';
    }
  }
}
