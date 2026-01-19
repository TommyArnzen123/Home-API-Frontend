import { Component, inject, OnDestroy, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { RegistrationService } from '../../../services/registration.service';
import { LoginService } from '../../../services/login.service';
import { ModalService } from '../../../services/modal.service';
import { HOME_PAGE_ROUTE } from '../../../constants/navigation-constants';
import { REGISTER_HOME_SUCCESS_MESSAGE } from '../../../constants/registration-constants';
import { REGISTER_HOME_ERROR_MODAL } from '../../../constants/error-constants';
import {
  IRegisterGenericEntityRequest,
  IRegisterGenericEntityResponse,
} from '../../../model/registration.interface';
import { IUser } from '../../../model/login.interface';

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
export class RegisterHome implements OnDestroy {
  subscriptions: Subscription[] = [];
  form!: FormGroup;

  user: Signal<IUser | null>;

  private readonly router = inject(Router);
  private readonly registrationService = inject(RegistrationService);
  private readonly loginService = inject(LoginService);
  private readonly modalService = inject(ModalService);

  constructor() {
    this.user = this.loginService.getUserLoginInfo();
  }

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
    const registerHomeRequest: IRegisterGenericEntityRequest = {
      parentEntityId: userId,
      name: homeName,
    };

    this.subscriptions.push(
      this.registrationService.registerHome(registerHomeRequest, jwtToken).subscribe({
        next: (response: IRegisterGenericEntityResponse) => {
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
