import { Component, inject, OnInit, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { ModalService } from '../../../services/modal';
import { RouterService } from '../../../services/router';
import { REGISTER_HOME_ERROR_MODAL } from '../../../constants/error-constants';
import { EntityActions, EntityStore } from '../../../store/entity.store';

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
export class RegisterHome implements OnInit {
  private readonly entityStore = inject(EntityStore);

  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);

  protected form!: FormGroup;

  constructor() {
    this.entityStore.resetNotificationState();
    this.setSuccessEffects();
  }

  private setSuccessEffects(): void {
    effect(() => {
      const success: EntityActions = this.entityStore.successNotification();

      if (success === 'register-home') {
        this.viewHomescreen();
      }
    });
  }

  ngOnInit(): void {
    this.entityStore.setPageMode('ADD_CHILD');
    this.form = new FormGroup({
      homeName: new FormControl('', [Validators.required]),
    });
  }

  protected register(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const homeName = this.form.get('homeName')?.value || '';

      if (homeName) {
        this.entityStore.registerHome(homeName);
      } else {
        this.modalService.showModalElement(REGISTER_HOME_ERROR_MODAL);
      }
    }
  }

  protected viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }
}
