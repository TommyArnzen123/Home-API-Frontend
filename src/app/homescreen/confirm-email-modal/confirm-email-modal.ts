import { Component, OnInit, OnDestroy, inject, effect, computed } from '@angular/core';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { numericValidator } from './confirm-email-modal-validators';
import { EntityStore, ErrorState } from '../../store/entity.store';
import { CONFIRM_EMAIL_CODE_TOO_MANY_ATTEMPTS_ERROR_MODAL } from '../../constants/error-constants';
import { ModalService } from '../../services/modal';

@Component({
  selector: 'temperature-threshold-modal',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatLabel,
    MatFormField,
    MatInput,
    MatError,
    ReactiveFormsModule,
  ],
  templateUrl: './confirm-email-modal.html',
  styleUrl: './confirm-email-modal.scss',
})
export class ConfirmEmailModal implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private entityStore = inject(EntityStore);
  private modalService = inject(ModalService);

  protected title: string = 'Confirm Email Address';

  private codeGenerationInfo = computed(() => this.entityStore.emailConfirmed().generatedCode);

  protected attemptsRemaining = computed(() => this.codeGenerationInfo()?.attemptsRemaining);
  protected expiresAt = computed(() => this.codeGenerationInfo()?.expiresAt);

  protected form!: FormGroup;

  constructor(private readonly modal: MatDialogRef<ConfirmEmailModal>) {
    this.setSuccessEffects();
    this.setErrorEffects();
    this.setGeneralEffects();
  }

  protected getMinutesUntilConfirmationCodeExpiration(): string {
    const currentDateTime = new Date();
    const expiresAtDateTime = this.expiresAt();
    let minutesUntilExpiration = 0;
    if (expiresAtDateTime) {
      const codeExpiresAtDateTime = new Date(expiresAtDateTime);
      const timeUntilExpiration = codeExpiresAtDateTime.getTime() - currentDateTime.getTime();

      // Convert milliseconds to minutes (1,000ms * 60 seconds = 60,000).
      minutesUntilExpiration = timeUntilExpiration / 60000;
    }

    const minutesValue = Math.abs(Math.round(minutesUntilExpiration));
    const minutesVerbiage = minutesValue === 1 ? ' minute' : ' minutes';

    return minutesValue + minutesVerbiage;
  }

  private setSuccessEffects(): void {
    effect(() => {
      const success = this.entityStore.successNotification();

      if (success === 'confirm-email') {
        // Close the modal if the email address is verified.
        this.closeModal();
      }
    });
  }

  private setErrorEffects(): void {
    effect(() => {
      const error: ErrorState | null = this.entityStore.errorNotification();
      const errorAction = error?.errorAction;
      const errorType = error?.errorData?.errorType;

      if (errorAction === 'confirm-email' && (!errorType || errorType !== 'CODE_MISMATCH')) {
        // Hide the confirm email code entry modal, so the confirm email error modal can be displayed.
        this.closeModal();
      }
    });
  }

  private setGeneralEffects(): void {
    effect(() => {
      const attemptsRemaining = this.attemptsRemaining();
      if (attemptsRemaining && attemptsRemaining === 0) {
        // Hide the email confirmation modal and display an error.
        // The user has input an incorrect code five times (the maximum allowed number of attempts).
        this.modalService.showModalElement(CONFIRM_EMAIL_CODE_TOO_MANY_ATTEMPTS_ERROR_MODAL);
        this.closeModal();
      }
    });
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      emailConfirmationCode: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{6}$/),
        numericValidator(),
      ]),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  // Validate the temperature threshold form.
  protected primaryAction(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const emailConfirmationCode: number | undefined =
        this.form.get('emailConfirmationCode')?.value || undefined;

      if (emailConfirmationCode) {
        // Verify the email confirmation code entered by the user.
        this.entityStore.confirmEmail(emailConfirmationCode);
      }
    }
  }

  protected cancelAction(): void {
    this.closeModal();
  }

  private closeModal(): void {
    this.modal.close();
  }
}
