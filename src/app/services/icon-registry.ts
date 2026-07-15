import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ICON_REGISTRY_REFERENCE } from '../constants/icon-registry';

@Injectable({
  providedIn: 'root',
})
export class IconRegistryService {
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    for (const [iconName, iconPath] of Object.entries(ICON_REGISTRY_REFERENCE)) {
      this.iconRegistry.addSvgIcon(
        iconName,
        this.sanitizer.bypassSecurityTrustResourceUrl(iconPath),
      );
    }
  }
}
