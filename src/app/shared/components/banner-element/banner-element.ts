import { Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions } from '@angular/material/card';
import { IBanner, IBannerActions } from '../../../model/banner';
import { IconElement } from '../icon-element/icon-element';
import { ICON_REFERENCE_KEYS } from '../../../constants/icon-registry';

@Component({
  selector: 'banner-element',
  imports: [MatButton, MatCard, MatCardActions, IconElement],
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

  protected getIconPath(): ICON_REFERENCE_KEYS {
    switch (this.bannerInfo().type) {
      case 'INFO':
        return 'thermometer-info-icon';
      case 'SUCCESS':
        return 'thermometer-success-icon';
      case 'WARNING':
        return 'thermometer-warning-icon';
      case 'ALERT':
        return 'thermometer-alert-icon';
    }
  }

  protected getIconAltText(): string {
    switch (this.bannerInfo().type) {
      case 'INFO':
        return 'Blue thermometer hot temperature (full) icon.';
      case 'SUCCESS':
        return 'Green thermometer hot temperature (full) icon.';
      case 'WARNING':
        return 'Orange thermometer hot temperature (full) icon.';
      case 'ALERT':
        return 'Red thermometer hot temperature (full) icon.';
    }
  }
}
