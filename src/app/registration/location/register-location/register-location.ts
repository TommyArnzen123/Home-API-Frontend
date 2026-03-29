import { Component, inject, Signal, OnInit, OnDestroy } from '@angular/core';
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
import { IUser } from '../../../model/login';
import {
  IRegisterGenericEntityRequest,
  IRegisterGenericEntityResponse,
} from '../../../model/registration';
import { REGISTER_LOCATION_SUCCESS_MESSAGE } from '../../../constants/registration-constants';
import { REGISTER_LOCATION_ERROR_MODAL } from '../../../constants/error-constants';

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

  private readonly route = inject(ActivatedRoute);
  private readonly routerService = inject(RouterService);
  private readonly registrationService = inject(RegistrationService);
  private readonly loginService = inject(LoginService);
  private readonly modalService = inject(ModalService);

  protected form!: FormGroup;
  private user: Signal<IUser | null>;
  private homeId!: number | null;

  constructor() {
    this.homeId = Number(this.route.snapshot.paramMap.get('homeId'));
    this.user = this.loginService.getUserLoginInfo();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      locationName: new FormControl('', [Validators.required]),
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

      if (this.user()) {
        this.registerLocationAction(locationName, this.user()?.jwtToken || '');
      }
    }
  }

  protected viewHomeById(): void {
    const id = this.homeId;

    if (id !== null) {
      this.routerService.viewHomeById(id);
    }
  }

  private registerLocationAction(locationName: string, jwtToken: string): void {
    if (this.homeId) {
      const registerLocationRequest: IRegisterGenericEntityRequest = {
        parentEntityId: Number(this.homeId),
        name: locationName,
      };

      this.subscriptions.push(
        this.registrationService.registerLocation(registerLocationRequest, jwtToken).subscribe({
          next: (response: IRegisterGenericEntityResponse) => {
            if (response) {
              // The location has been added to the application.
              // Display a modal message and route the user to the view home component.
              this.modalService.showModalElement(REGISTER_LOCATION_SUCCESS_MESSAGE);
              this.viewHomeById();
            }
          },
          error: () => {
            this.modalService.showModalElement(REGISTER_LOCATION_ERROR_MODAL);
          },
        }),
      );
    }
  }
}
