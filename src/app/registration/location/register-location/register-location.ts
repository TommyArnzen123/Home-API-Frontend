import { Component, Signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { IUser } from '../../../model/login.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationService } from '../../../services/registration.service';
import { LoginService } from '../../../services/login.service';
import { Subscription } from 'rxjs';
import { HOME_PAGE_ROUTE, VIEW_HOME } from '../../../constants/navigation-constants';
import { IRegisterLocationRequest, IRegisterLocationResponse } from '../../../model/registration.interface';

@Component({
  selector: 'register-location',
  imports: [MatCard,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatInput,
    MatError,
    MatButtonModule,
    ReactiveFormsModule,],
  templateUrl: './register-location.html',
  styleUrl: './register-location.scss',
})
export class RegisterLocation {
  user: Signal<IUser | null>;
  homeId!: string | null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly registrationService: RegistrationService,
    private readonly loginService: LoginService,
  ) {
    this.homeId = this.route.snapshot.paramMap.get('homeId');
    this.user = this.loginService.getUserLoginInfo();
  }

  subscriptions: Subscription[] = [];
  form!: FormGroup;

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

  register() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const locationName = this.form.get('locationName')?.value || '';

      if (this.user()) {
        this.registerLocationAction(locationName, this.user()?.jwtToken || '');
      }
    }
  }

  returnToViewHomeInformationScreen() {
    // Return to the view home screen.
    this.router.navigate([VIEW_HOME, this.homeId]);
  }

  registerLocationAction(locationName: string, jwtToken: string) {

    if (this.homeId) {
      const registerLocationRequest:  IRegisterLocationRequest = {
        homeId: Number(this.homeId),
        locationName,
      };

      this.subscriptions.push(
        this.registrationService.registerLocation(registerLocationRequest, jwtToken).subscribe({
          next: (response: IRegisterLocationResponse) => {
            if (response) {
              console.log(response);
              this.returnToViewHomeInformationScreen();
            }
          },
          error: () => {
            console.error('There was an error');
          },
        }),
      );
  }
  }
}
