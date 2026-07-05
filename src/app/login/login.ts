import { Component, computed, effect, inject, OnDestroy } from '@angular/core';
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
import { ILoginInfo, ILoginRequest } from '../model/login';
import { EntityStore } from '../store/entity.store';

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
export class Login implements OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly routerService = inject(RouterService);
  private readonly loginService = inject(LoginService);
  private readonly entityStore = inject(EntityStore);

  private readonly isLoggedIn = computed(() => this.entityStore.userInitialized());

  protected form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  protected error!: string;

  constructor() {
    effect(() => {
      if (this.isLoggedIn()) {
        this.viewHomescreen();
      }
    });
  }

  // ngOnInit(): void {
  //   const user: Signal<ILoginInfo | null> = this.loginService.getLoginInfo();

  //   // If the user is logged in (the user value is set in the login service),
  //   // route the user to the home page component.
  //   if (user()) {
  //     this.viewHomescreen();
  //   }
  // }

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

  private viewHomescreen(): void {
    this.routerService.viewHomescreen();
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
          next: (response: ILoginInfo) => {
            if (response) {
              console.log(response);
              this.viewHomescreen();
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
