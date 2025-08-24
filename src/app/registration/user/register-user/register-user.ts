import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatError } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LOGIN_ROUTE } from '../../../constants/navigation-constants';
import { RegistrationService } from '../../../services/registration.service';
import { IRegisterUserRequest, IRegisterUserResponse } from '../../../model/registration.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'home-register-user',
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
  templateUrl: './register-user.html',
  styleUrl: './register-user.scss',
})
export class RegisterUser implements OnInit, OnDestroy {
  constructor(
    private readonly router: Router,
    private readonly registrationService: RegistrationService,
  ) {}

  subscriptions: Subscription[] = [];
  form!: FormGroup;
  error!: string;

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
      },
      [this.passwordConfirmationValidator()],
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  register() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const firstName = this.form.get('firstName')?.value || '';
      const lastName = this.form.get('lastName')?.value || '';
      const username = this.form.get('username')?.value || '';
      const password = this.form.get('password')?.value || '';
      const email = this.form.get('email')?.value || '';

      this.registerUserAction(firstName, lastName, username, password, email);
    }
  }

  returnToLogin() {
    // Return to the login component.
    this.router.navigateByUrl(LOGIN_ROUTE);
  }

  registerUserAction(
    firstNameValue: string,
    lastNameValue: string,
    usernameValue: string,
    passwordValue: string,
    emailValue: string,
  ) {
    const registerUserRequest: IRegisterUserRequest = {
      firstName: firstNameValue,
      lastName: lastNameValue,
      username: usernameValue,
      password: passwordValue,
      email: emailValue,
    };

    this.subscriptions.push(
      this.registrationService.registerUser(registerUserRequest).subscribe({
        next: (response: IRegisterUserResponse) => {
          if (response) {
            // The user has been added to the application.
            // Route the user to the login component.
            this.router.navigateByUrl(LOGIN_ROUTE);
          }
        },
        error: () => {
          this.error = 'There was an error registering the user.';
        },
      }),
    );
  }

  passwordConfirmationValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordField = control.get('password');
      const passwordConfirmationField = control.get('confirmPassword');

      if (passwordField?.touched && passwordConfirmationField?.touched) {
        if (passwordField?.value !== passwordConfirmationField?.value) {
          return { passwordConfirmationError: true };
        }
      }

      return null;
    };
  }
}
