import { Component, inject, OnInit, OnDestroy, computed, Signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EntityStore } from '../store/entity.store';
import { RouterService } from '../services/router';
import { generateBreadcrumbEntityPath, generateBreadcrumbSuffix } from './breadcrumb-helper';
import { ABOUT_ROUTE, SETTINGS_ROUTE } from '../constants/navigation-constants';
import { IBreadcrumbItemDisplay } from '../model/breadcrumb';

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly entityStore = inject(EntityStore);
  private readonly router = inject(Router);
  private readonly routerService = inject(RouterService);

  // Determines if the breadcrumb component is rendered.
  // Some pages (paths) do not display the breadcrumb component (e.g. settings, about, etc.).
  protected showBreadcrumbComponent = true;

  // The 'USER' entityPath element (which represents the homescreen or root node of the application)
  // should always be in position '0' of the 'entityPath' field.
  protected readonly isHomescreen = computed(
    () => this.entityStore.entityPath().length === 1 && this.entityStore.pageMode() === 'VIEW',
  );

  protected readonly entityPath: Signal<IBreadcrumbItemDisplay[]> = computed(() => {
    const path = this.entityStore.entityPath();

    return generateBreadcrumbEntityPath(path);
  });

  protected readonly pageMode = computed(() => this.entityStore.pageMode());

  // Set the label to be used in the 'Add Entity' and 'Edit Entity' use-cases.
  protected readonly breadcrumbSuffix = computed(() => {
    const path = this.entityPath();
    const mode = this.pageMode();

    if (!mode) return null;

    return generateBreadcrumbSuffix(path, mode);
  });

  protected navigate(item: IBreadcrumbItemDisplay): void {
    this.routerService.breadcrumbRoute(item);
  }

  // Show or hide the breadcrumb component.
  ngOnInit(): void {
    this.subscriptions.push(
      this.router.events.subscribe((route) => {
        if (route instanceof NavigationEnd) {
          if (route.url === '/' + SETTINGS_ROUTE || route.url === '/' + ABOUT_ROUTE) {
            this.showBreadcrumbComponent = false;
          } else {
            this.showBreadcrumbComponent = true;
          }
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
