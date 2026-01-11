import { Component, Signal } from '@angular/core';
import { IUser } from '../../../model/login.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationService } from '../../../services/registration.service';
import { LoginService } from '../../../services/login.service';
import { ModalService } from '../../../services/modal.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VIEW_LOCATION } from '../../../constants/navigation-constants';
import { IRegisterGenericEntityRequest, IRegisterGenericEntityResponse } from '../../../model/registration.interface';
import { REGISTER_DEVICE_SUCCESS_MESSAGE } from '../../../constants/registration-constants';
import { REGISTER_DEVICE_ERROR_MODAL } from '../../../constants/error-constants';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'register-device',
  imports: [MatCard,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatInput,
    MatError,
    MatButtonModule,
    ReactiveFormsModule,],
  templateUrl: './register-device.html',
  styleUrl: './register-device.scss',
})
export class RegisterDevice {
  user: Signal<IUser | null>;
  locationId!: string | null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly registrationService: RegistrationService,
    private readonly loginService: LoginService,
    private readonly modalService: ModalService,
  ) {
    this.locationId = this.route.snapshot.paramMap.get('locationId');
    this.user = this.loginService.getUserLoginInfo();
  }

  subscriptions: Subscription[] = [];
  form!: FormGroup;

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

  register() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const deviceName = this.form.get('deviceName')?.value || '';

      if (this.user()) {
        this.registerDeviceAction(deviceName, this.user()?.jwtToken || '');
      }
    }
  }

  returnToViewLocationInformationScreen() {
    // Return to the view location screen.
    this.router.navigate([VIEW_LOCATION, this.locationId]);
  }

  registerDeviceAction(deviceName: string, jwtToken: string) {

    if (this.locationId) {
      const registerDeviceRequest:  IRegisterGenericEntityRequest = {
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
              this.returnToViewLocationInformationScreen();
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
