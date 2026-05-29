import { Component, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '../../../services/modal';
import { RouterService } from '../../../services/router';
import { IModalActions } from '../../../model/modal';
import {
  INVALID_HOME_ID_ERROR_MODAL,
  REGISTER_LOCATION_ERROR_MODAL,
} from '../../../constants/error-constants';
import { EntityActions, EntityStore } from '../../../store/entity.store';

@Component({
  selector: 'register-location',
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
  templateUrl: './register-location.html',
  styleUrl: './register-location.scss',
})
export class RegisterLocation implements OnInit {
  private readonly entityStore = inject(EntityStore);

  private readonly route = inject(ActivatedRoute);
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);

  protected form!: FormGroup;
  protected homeId: number | null;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('homeId'));

    // Verify the home ID provided in the URL is a valid number.
    if (isNaN(id)) {
      this.homeId = null;
      const modalActions: IModalActions = {
        primaryAction: () => this.viewHomescreen(),
      };
      this.modalService.showModalElement(INVALID_HOME_ID_ERROR_MODAL, modalActions);
    } else {
      this.homeId = id;

      this.entityStore.resetNotificationState();
      this.setSuccessEffects();
    }
  }

  private setSuccessEffects(): void {
    effect(() => {
      const success: EntityActions = this.entityStore.successNotification();

      if (success === 'register-location') {
        this.viewHomeById();
      }
    });
  }

  ngOnInit(): void {
    this.entityStore.setPageMode('ADD_CHILD');
    this.form = new FormGroup({
      locationName: new FormControl('', [Validators.required]),
    });
  }

  protected register(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const locationName = this.form.get('locationName')?.value || '';

      if (this.homeId && locationName) {
        this.entityStore.registerLocation({ parentEntityId: this.homeId, name: locationName });
      } else {
        this.modalService.showModalElement(REGISTER_LOCATION_ERROR_MODAL);
      }
    }
  }

  private viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }

  protected viewHomeById(): void {
    const id = this.homeId;

    if (id !== null) {
      this.routerService.viewHomeById(id);
    } else {
      this.viewHomescreen();
    }
  }
}
