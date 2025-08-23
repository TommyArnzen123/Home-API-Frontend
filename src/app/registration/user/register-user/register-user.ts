import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

@Component({
  selector: 'home-register-user',
  imports: [MatCard, MatCardTitle, MatCardContent, MatFormField, MatInput, MatError, MatButtonModule, ReactiveFormsModule],
  templateUrl: './register-user.html',
  styleUrl: './register-user.scss'
})
export class RegisterUser {

  constructor(
    private readonly router: Router,
    private readonly registrationService: RegistrationService
  ) {}

  error!: string;
  
  form: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    email: new FormControl(''),
  });

  register() {

    // Reset the error value when the 'Register' button is clicked.
    this.error = '';

    if (this.form.valid) {
      const firstName = this.form.get('firstName')?.value || '';
      const lastName = this.form.get('lastName')?.value || '';
      const username = this.form.get('username')?.value || '';
      const password = this.form.get('password')?.value || '';
      const confirmPassword = this.form.get('confirmPassword')?.value || '';
      const email = this.form.get('email')?.value || ''


      // Password and confirm password values must match before registering the user.
      if (password === confirmPassword) {
        this.registerUserAction(firstName, lastName, username, password, email);
      } else {
        this.error = 'Password and password confirmation must match.';
      }
    } else {
      this.error = 'There was an error logging in.';
    }
  }

  returnToLogin() {
    // Return to the login component.
    this.router.navigateByUrl(LOGIN_ROUTE);
  }

  registerUserAction(firstNameValue: string, lastNameValue: string, usernameValue: string, passwordValue: string, emailValue: string) {

    const registerUserRequest: IRegisterUserRequest = {
      firstName: firstNameValue,
      lastName: lastNameValue,
      username: usernameValue,
      password: passwordValue,
      email: emailValue
    }

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
      }
    });
  }

}
