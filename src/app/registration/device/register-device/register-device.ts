import { Component, inject, OnInit, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ModalService } from '../../../services/modal';
import { RouterService } from '../../../services/router';
import { BreadcrumbService } from '../../../services/breadcrumb';
import { IModalActions } from '../../../model/modal';
import {
  INVALID_LOCATION_ID_ERROR_MODAL,
  REGISTER_DEVICE_ERROR_MODAL,
} from '../../../constants/error-constants';
import { EntityActions, EntityStore } from '../../../store/entity.store';

@Component({
  selector: 'register-device',
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
  templateUrl: './register-device.html',
  styleUrl: './register-device.scss',
})
export class RegisterDevice implements OnInit {
  private readonly entityStore = inject(EntityStore);

  private readonly route = inject(ActivatedRoute);
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  protected form!: FormGroup;
  protected locationId: number | null = null;

  constructor() {
    this.breadcrumbService.updatePageInFocus('register-device');
    const id = Number(this.route.snapshot.paramMap.get('locationId'));

    // Verify the location ID provided in the URL is a valid number.
    if (isNaN(id)) {
      this.locationId = null;
      const modalActions: IModalActions = {
        primaryAction: () => this.viewHomescreen(),
      };
      this.modalService.showModalElement(INVALID_LOCATION_ID_ERROR_MODAL, modalActions);
    } else {
      this.locationId = id;

      this.entityStore.resetNotificationState();
      this.setSuccessEffects();
    }
  }

  private setSuccessEffects(): void {
    effect(() => {
      const success: EntityActions = this.entityStore.successNotification();

      if (success === 'register-device') {
        this.viewLocationById();
      }
    });
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      deviceName: new FormControl('', [Validators.required]),
    });
  }

  protected register(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const deviceName = this.form.get('deviceName')?.value || '';

      if (this.locationId && deviceName) {
        this.entityStore.registerDevice({ parentEntityId: this.locationId, name: deviceName });
      } else {
        this.modalService.showModalElement(REGISTER_DEVICE_ERROR_MODAL);
      }
    }
  }

  private viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }

  protected viewLocationById(): void {
    const id = this.locationId;

    if (id !== null) {
      this.routerService.viewLocationById(id);
    } else {
      this.viewHomescreen();
    }
  }
}
