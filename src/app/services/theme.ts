import { Injectable, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ThemeDisplayOptions } from '../model/account-settings';
import { EntityStore } from '../store/entity.store';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly entityStore = inject(EntityStore);
  private themeSetting: ThemeDisplayOptions = ThemeDisplayOptions.LIGHT; // Default the value to 'light' mode.

  constructor() {
    effect(() => {
      this.themeSetting =
        this.entityStore.accountSettings()?.themeDisplaySetting ?? ThemeDisplayOptions.LIGHT;
      this.applyTheme();
    });
  }

  private applyTheme(): void {
    const html = this.document.documentElement;

    if (this.themeSetting === ThemeDisplayOptions.LIGHT) {
      html.classList.remove('dark-theme');
      html.classList.add('light-theme');
    }

    if (this.themeSetting === ThemeDisplayOptions.DARK) {
      html.classList.remove('light-theme');
      html.classList.add('dark-theme');
    }
  }
}
