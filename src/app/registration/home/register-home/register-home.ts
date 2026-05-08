import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal';
import { RouterService } from '../../../services/router';
import { BreadcrumbService } from '../../../services/breadcrumb';
import { REGISTER_HOME_SUCCESS_MODAL } from '../../../constants/success-constants';
import { REGISTER_HOME_ERROR_MODAL } from '../../../constants/error-constants';
import { HomescreenActions, HomescreenStore } from '../../../homescreen/homescreen.store';

@Component({
  selector: 'register-home',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatInput,
    MatError,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register-home.html',
  styleUrl: './register-home.scss',
})
export class RegisterHome implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly homescreenStore = inject(HomescreenStore);

  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  protected form!: FormGroup;

  constructor() {
    this.breadcrumbService.updatePageInFocus('register-home');

    this.homescreenStore.resetNotificationState(); // Prevent routing from previous success notification.
    this.setSuccessEffects();
    this.setErrorEffects();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      homeName: new FormControl('', [Validators.required]),
    });
  }

  private setSuccessEffects(): void {
    effect(() => {
      const success: HomescreenActions = this.homescreenStore.successNotification();

      if (success === 'register-home') {
        this.modalService.showModalElement(REGISTER_HOME_SUCCESS_MODAL);
        this.viewHomescreen();
      }
    });
  }

  private setErrorEffects(): void {
    effect(() => {
      const error: HomescreenActions = this.homescreenStore.errorNotification();

      if (error === 'register-home') {
        this.modalService.showModalElement(REGISTER_HOME_ERROR_MODAL);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  protected register(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const homeName = this.form.get('homeName')?.value || '';

      if (homeName) {
        this.homescreenStore.registerHome(homeName);
      } else {
        this.modalService.showModalElement(REGISTER_HOME_ERROR_MODAL);
      }
    }
  }

  protected viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }
}
