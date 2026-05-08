import { Component, inject, Signal, OnInit, OnDestroy, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RegistrationService } from '../../../services/registration';
import { LoginService } from '../../../services/login';
import { ModalService } from '../../../services/modal';
import { RouterService } from '../../../services/router';
import { BreadcrumbService } from '../../../services/breadcrumb';
import { IUser } from '../../../model/login';
import {
  IRegisterGenericEntityRequest,
  IRegisterGenericEntityResponse,
} from '../../../model/registration';
import { IModalActions } from '../../../model/modal';
import { REGISTER_LOCATION_SUCCESS_MODAL } from '../../../constants/success-constants';
import {
  INVALID_HOME_ID_ERROR_MODAL,
  REGISTER_LOCATION_ERROR_MODAL,
} from '../../../constants/error-constants';
import { ViewHomeActions, ViewHomeStore } from '../../../home/view-home/view-home.store';

@Component({
  selector: 'register-location',
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
  templateUrl: './register-location.html',
  styleUrl: './register-location.scss',
})
export class RegisterLocation implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly viewHomeStore = inject(ViewHomeStore);

  private readonly route = inject(ActivatedRoute);
  private readonly routerService = inject(RouterService);
  private readonly registrationService = inject(RegistrationService);
  private readonly loginService = inject(LoginService);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  protected form!: FormGroup;
  protected homeId: number | null = null;

  constructor() {
    this.breadcrumbService.updatePageInFocus('register-location');
    const id = Number(this.route.snapshot.paramMap.get('homeId'));

    if (isNaN(id)) {
      this.homeId = null;
      const modalActions: IModalActions = {
        primaryAction: () => this.viewHomescreen(),
      };
      this.modalService.showModalElement(INVALID_HOME_ID_ERROR_MODAL, modalActions);
    } else {
      this.homeId = id;
      this.viewHomeStore.resetNotificationState(); // Prevent routing from previous success notification.
      this.setSuccessEffects();
      this.setErrorEffects();
    }
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      locationName: new FormControl('', [Validators.required]),
    });
  }

  private setSuccessEffects(): void {
    effect(() => {
      const success: ViewHomeActions = this.viewHomeStore.successNotification();

      if (success === 'register-location') {
        this.modalService.showModalElement(REGISTER_LOCATION_SUCCESS_MODAL);
        this.viewHomeById();
      }
    });
  }

  private setErrorEffects(): void {
    effect(() => {
      const error: ViewHomeActions = this.viewHomeStore.errorNotification();

      if (error === 'register-location') {
        this.modalService.showModalElement(REGISTER_LOCATION_ERROR_MODAL);
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
      const locationName = this.form.get('locationName')?.value || '';

      if (this.homeId && locationName) {
        this.viewHomeStore.registerLocation({ parentEntityId: this.homeId, name: locationName });
      } else {
        this.modalService.showModalElement(REGISTER_LOCATION_ERROR_MODAL);
      }
    }
  }

  private viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }

  protected viewHomeById(): void {
    const id = this.homeId;

    if (id !== null) {
      this.routerService.viewHomeById(id);
    }
  }
}
