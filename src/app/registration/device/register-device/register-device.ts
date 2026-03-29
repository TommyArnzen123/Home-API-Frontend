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
import { IUser } from '../../../model/login';
import {
  IRegisterGenericEntityRequest,
  IRegisterGenericEntityResponse,
} from '../../../model/registration';
import { REGISTER_DEVICE_SUCCESS_MESSAGE } from '../../../constants/registration-constants';
import { REGISTER_DEVICE_ERROR_MODAL } from '../../../constants/error-constants';

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

  protected form!: FormGroup;
  private user: Signal<IUser | null>;
  private locationId!: number | null;

  constructor() {
    this.locationId = Number(this.route.snapshot.paramMap.get('locationId'));
    this.user = this.loginService.getUserLoginInfo();
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

      if (this.user()) {
        this.registerDeviceAction(deviceName, this.user()?.jwtToken || '');
      }
    }
  }

  protected viewLocationById(): void {
    const id = this.locationId;

    if (id !== null) {
      this.routerService.viewLocationById(id);
    }
  }

  private registerDeviceAction(deviceName: string, jwtToken: string): void {
    if (this.locationId) {
      const registerDeviceRequest: IRegisterGenericEntityRequest = {
        parentEntityId: Number(this.locationId),
        name: deviceName,
      };

      this.subscriptions.push(
        this.registrationService.registerDevice(registerDeviceRequest, jwtToken).subscribe({
          next: (response: IRegisterGenericEntityResponse) => {
            if (response) {
              // The device has been added to the application.
              // Display a modal message and route the user to the view location component.
              this.modalService.showModalElement(REGISTER_DEVICE_SUCCESS_MESSAGE);
              this.viewLocationById();
            }
          },
          error: () => {
            this.modalService.showModalElement(REGISTER_DEVICE_ERROR_MODAL);
          },
        }),
      );
    }
  }
}
