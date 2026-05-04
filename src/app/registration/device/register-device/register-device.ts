import { Component, inject, Signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
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
import { REGISTER_DEVICE_SUCCESS_MODAL } from '../../../constants/success-constants';
import {
  INVALID_LOCATION_ID_ERROR_MODAL,
  REGISTER_DEVICE_ERROR_MODAL,
} from '../../../constants/error-constants';

@Component({
  selector: 'register-device',
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
  templateUrl: './register-device.html',
  styleUrl: './register-device.scss',
})
export class RegisterDevice implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly route = inject(ActivatedRoute);
  private readonly routerService = inject(RouterService);
  private readonly registrationService = inject(RegistrationService);
  private readonly loginService = inject(LoginService);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  protected form!: FormGroup;
  protected locationId: number | null = null;

  constructor() {
    this.breadcrumbService.updatePageInFocus('register-device');
    const id = Number(this.route.snapshot.paramMap.get('locationId'));

    // Verify the location ID provided in the URL is a valid number.
    if (isNaN(id)) {
      this.locationId = null;
      const modalActions: IModalActions = {
        primaryAction: () => this.viewHomescreen(),
      };
      this.modalService.showModalElement(INVALID_LOCATION_ID_ERROR_MODAL, modalActions);
    } else {
      this.locationId = id;
    }
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      deviceName: new FormControl('', [Validators.required]),
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
      const deviceName = this.form.get('deviceName')?.value || '';

      if (deviceName) {
        this.registerDeviceAction(deviceName);
      }
    }
  }

  protected viewLocationById(): void {
    const id = this.locationId;

    if (id !== null) {
      this.routerService.viewLocationById(id);
    }
  }

  private viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }

  private registerDeviceAction(deviceName: string): void {
    const user: Signal<IUser | null> = this.loginService.getUserLoginInfo();
    const jwtToken = user()?.jwtToken;

    if (this.locationId && jwtToken && deviceName) {
      const registerDeviceRequest: IRegisterGenericEntityRequest = {
        parentEntityId: this.locationId,
        name: deviceName,
      };

      this.subscriptions.push(
        this.registrationService.registerDevice(registerDeviceRequest, jwtToken).subscribe({
          next: (response: IRegisterGenericEntityResponse) => {
            if (response) {
              // The device has been added to the application.
              // Display a modal message and route the user to the view location component.
              this.modalService.showModalElement(REGISTER_DEVICE_SUCCESS_MODAL);
              this.viewLocationById();
            }
          },
          error: () => {
            this.modalService.showModalElement(REGISTER_DEVICE_ERROR_MODAL);
          },
        }),
      );
    } else {
      this.modalService.showModalElement(REGISTER_DEVICE_ERROR_MODAL);
    }
  }
}
