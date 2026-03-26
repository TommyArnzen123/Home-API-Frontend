import { Component, inject, OnInit, OnDestroy, Signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatError } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from '../services/login.service';
import { ILoginRequest, IUser } from '../model/login.interface';
import { HOME_PAGE_ROUTE, REGISTER_USER_ROUTE } from '../constants/navigation-constants';
import { RouterService } from '../services/router.service';

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
export class LoginComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  error!: string;

  private readonly routerService = inject(RouterService);
  private readonly loginService = inject(LoginService);

  ngOnInit(): void {
    const user: Signal<IUser | null> = this.loginService.getUserLoginInfo();

    // If the user is logged in (the user value is set in the login service),
    // route the user to the home page component.
    if (user()) {
      this.viewHomePage();
    }
  }

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

  viewHomePage(): void {
    this.routerService.viewHomePage();
  }

  viewRegisterUserPage() {
    this.routerService.viewRegisterUserPage();
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
              this.viewHomePage();
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
