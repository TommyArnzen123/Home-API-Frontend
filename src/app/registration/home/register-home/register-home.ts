import { Component, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '../../../services/registration.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IRegisterHomeRequest,
  IRegisterHomeResponse,
  IRegisterUserResponse,
} from '../../../model/registration.interface';
import { HOME_PAGE_ROUTE } from '../../../constants/navigation-constants';
import { LoginService } from '../../../services/login.service';
import { IUser } from '../../../model/login.interface';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { ModalService } from '../../../services/modal.service';
import { REGISTER_HOME_SUCCESS_MESSAGE } from '../../../constants/registration-constants';
import { REGISTER_HOME_ERROR_MODAL } from '../../../constants/error-constants';

@Component({
  selector: 'register-home',
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
  templateUrl: './register-home.html',
  styleUrl: './register-home.scss',
})
export class RegisterHome {
  user: Signal<IUser | null>;

  constructor(
    private readonly router: Router,
    private readonly registrationService: RegistrationService,
    private readonly loginService: LoginService,
    private readonly modalService: ModalService,
  ) {
    this.user = this.loginService.getUserLoginInfo();
  }

  subscriptions: Subscription[] = [];
  form!: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      homeName: new FormControl('', [Validators.required]),
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
      const homeName = this.form.get('homeName')?.value || '';

      if (this.user()) {
        this.registerHomeAction(Number(this.user()?.userId), homeName, this.user()?.jwtToken || '');
      }
    }
  }

  returnToHomePage() {
    // Return to the home page component.
    this.router.navigateByUrl(HOME_PAGE_ROUTE);
  }

  registerHomeAction(userId: number, homeName: string, jwtToken: string) {
    const registerHomeRequest: IRegisterHomeRequest = {
      userId,
      homeName,
    };

    this.subscriptions.push(
      this.registrationService.registerHome(registerHomeRequest, jwtToken).subscribe({
        next: (response: IRegisterHomeResponse) => {
          if (response) {
            // The home has been added to the application.
            // Display a success modal and route the user to the home page component.
            this.modalService.showModalElement(REGISTER_HOME_SUCCESS_MESSAGE);
            this.router.navigateByUrl(HOME_PAGE_ROUTE);
          }
        },
        error: () => {
          this.modalService.showModalElement(REGISTER_HOME_ERROR_MODAL);
        },
      }),
    );
  }
}
