import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatError } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { ILoginRequest, ILoginResponse } from '../model/login.interface';
import { SessionStorageService } from '../services/session-storage.service';
import { JWT_TOKEN } from '../constants/session-storage-constants';
import { Router } from '@angular/router';
import { APP_ROOT_ROUTE, REGISTER_USER_ROUTE } from '../constants/navigation-constants';

@Component({
  selector: 'home-login-component',
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
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  constructor(
    private readonly loginService: LoginService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly router: Router,
  ) {}

  error!: string;

  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  login() {
    // Reset the error value when the 'Login' buttton is clicked.
    this.error = '';

    this.form.markAllAsTouched();

    if (this.form.valid) {
      const username = this.form.get('username')?.value;
      const password = this.form.get('password')?.value;
      this.loginAction(username, password);
    }
  }

  register() {
    // Route the user to the user registration component.
    this.router.navigateByUrl(REGISTER_USER_ROUTE);
  }

  loginAction(usernameValue: string, passwordValue: string) {
    const loginRequest: ILoginRequest = {
      username: usernameValue,
      password: passwordValue,
    };

    if (this.form.valid) {
      this.loginService.login(loginRequest).subscribe({
        next: (response: ILoginResponse) => {
          if (response) {
            this.loginService.updateLoginStatus(true);
            this.sessionStorageService.setItem(JWT_TOKEN, response.jwtToken);
            this.router.navigateByUrl(APP_ROOT_ROUTE);
          }
        },
        error: () => {
          this.error = 'There was an error logging in.';
        },
      });
    }
  }
}
