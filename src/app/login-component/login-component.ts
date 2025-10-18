import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatError } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { ILoginRequest, IUser } from '../model/login.interface';
import { Router } from '@angular/router';
import { HOME_PAGE_ROUTE, REGISTER_USER_ROUTE } from '../constants/navigation-constants';
import { Subscription } from 'rxjs';

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
export class LoginComponent implements OnDestroy {
  subscriptions: Subscription[] = [];
  error!: string;

  constructor(
    private readonly loginService: LoginService,
    private readonly router: Router,
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

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

  loginAction(username: string, password: string) {
    const loginRequest: ILoginRequest = {
      username,
      password,
    };

    if (this.form.valid) {
      this.subscriptions.push(
        this.loginService.login(loginRequest).subscribe({
          next: (response: IUser) => {
            if (response) {
              this.router.navigateByUrl(HOME_PAGE_ROUTE);
            }
          },
          error: () => {
            this.error = 'There was an error logging in.';
          },
        }),
      );
    }
  }
}
