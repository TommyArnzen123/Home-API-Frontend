import { Component, inject, OnInit, OnDestroy, Signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatError } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginService } from '../services/login';
import { RouterService } from '../services/router';
import { ILoginRequest, IUser } from '../model/login';

@Component({
  selector: 'login',
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
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly routerService = inject(RouterService);
  private readonly loginService = inject(LoginService);

  protected form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  protected error!: string;

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

  protected login(): void {
    // Reset the error value when the 'Login' buttton is clicked.
    this.error = '';

    this.form.markAllAsTouched();

    if (this.form.valid) {
      const username = this.form.get('username')?.value;
      const password = this.form.get('password')?.value;
      this.loginAction(username, password);
    }
  }

  private viewHomePage(): void {
    this.routerService.viewHomePage();
  }

  protected viewRegisterUserPage(): void {
    this.routerService.viewRegisterUserPage();
  }

  private loginAction(username: string, password: string): void {
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
