import { Component, inject, OnInit, OnDestroy, Signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { RegistrationService } from '../../../services/registration';
import { LoginService } from '../../../services/login';
import { ModalService } from '../../../services/modal';
import { RouterService } from '../../../services/router';
import { BreadcrumbService } from '../../../services/breadcrumb';
import {
  IRegisterGenericEntityRequest,
  IRegisterGenericEntityResponse,
} from '../../../model/registration';
import { IUser } from '../../../model/login';
import { REGISTER_HOME_SUCCESS_MODAL } from '../../../constants/success-constants';
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
export class RegisterHome implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly routerService = inject(RouterService);
  private readonly registrationService = inject(RegistrationService);
  private readonly loginService = inject(LoginService);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  protected form!: FormGroup;

  constructor() {
    this.breadcrumbService.updatePageInFocus('register-home');
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

  protected register(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const homeName = this.form.get('homeName')?.value || '';

      if (homeName) {
        this.registerHomeAction(homeName);
      } else {
        this.modalService.showModalElement(REGISTER_HOME_ERROR_MODAL);
      }
    }
  }

  protected viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }

  private registerHomeAction(homeName: string): void {
    const user: Signal<IUser | null> = this.loginService.getUserLoginInfo();
    const userId = user()?.userId;
    const jwtToken = user()?.jwtToken;

    if (userId && jwtToken && homeName) {
      const registerHomeRequest: IRegisterGenericEntityRequest = {
        parentEntityId: userId,
        name: homeName,
      };

      this.subscriptions.push(
        this.registrationService.registerHome(registerHomeRequest, jwtToken).subscribe({
          next: (response: IRegisterGenericEntityResponse) => {
            if (response) {
              // The home has been added to the application.
              // Display a success modal and route the user to the homescreen component.
              this.modalService.showModalElement(REGISTER_HOME_SUCCESS_MODAL);
              this.viewHomescreen();
            }
          },
          error: () => {
            this.modalService.showModalElement(REGISTER_HOME_ERROR_MODAL);
          },
        }),
      );
    } else {
      this.modalService.showModalElement(REGISTER_HOME_ERROR_MODAL);
    }
  }
}
