import { Component, inject, OnInit, effect, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { EntityActions, EntityStore } from '../../store/entity.store';
import { RouterService } from '../../services/router';
import { ModalService } from '../../services/modal';
import {
  EDIT_DEVICE_ERROR_MODAL,
  EDIT_LOCATION_ERROR_MODAL,
  INVALID_DEVICE_ID_ERROR_MODAL,
  INVALID_LOCATION_ID_ERROR_MODAL,
} from '../../constants/error-constants';
import { IModalActions } from '../../model/modal';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'edit-device',
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
  templateUrl: './edit-device.html',
  styleUrl: './edit-device.scss',
})
export class EditDevice implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly entityStore = inject(EntityStore);
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);

  protected deviceId = signal<number | null>(null);

  private deviceInfo = computed(() => {
    const deviceId = this.deviceId();
    if (deviceId) {
      return this.entityStore.devices()[deviceId];
    } else {
      return null;
    }
  });

  protected form!: FormGroup;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('deviceId'));

    if (isNaN(id)) {
      // If the value provided for the deviceId is not a number, route the user to the
      // homescreen. No device data can be received if a valid device ID is not provided.
      const editDeviceInvalidDeviceIDErrorActions: IModalActions = {
        primaryAction: () => this.viewHomescreen(),
      };
      this.modalService.showModalElement(
        INVALID_DEVICE_ID_ERROR_MODAL,
        editDeviceInvalidDeviceIDErrorActions,
      );
      this.deviceId.set(null);
    } else {
      this.deviceId.set(id);
      this.entityStore.resetNotificationState();
      this.setSuccessEffects();
      this.setErrorEffects();
      this.verifyDeviceInfoSet();
    }
  }

  private setSuccessEffects(): void {
    effect(() => {
      const success: EntityActions = this.entityStore.successNotification();

      if (success === 'edit-device') {
        this.viewDeviceById();
      }
    });
  }

  private setErrorEffects(): void {
    effect(() => {
      const error: EntityActions | undefined = this.entityStore.errorNotification()?.errorAction;

      if (error === 'get-view-device-info') {
        this.viewHomescreen();
      }
    });
  }

  private verifyDeviceInfoSet(): void {
    effect(() => {
      const deviceId = this.deviceId();

      if (deviceId) {
        const deviceInfoVerification = this.entityStore.devices()[deviceId];

        if (!deviceInfoVerification?.details) {
          this.entityStore.getViewDeviceInfo(deviceId); // Get the device info if not set in the signal store.
        }
      }
    });

    effect(() => {
      this.form.patchValue({ deviceName: this.deviceInfo()?.details?.deviceName });
    });
  }

  ngOnInit(): void {
    this.entityStore.setPageMode('EDIT');

    this.form = new FormGroup({
      deviceName: new FormControl('', [Validators.required]),
    });
  }

  protected update(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const deviceName = this.form.get('deviceName')?.value || '';

      const deviceId = this.deviceId();
      if (deviceId && deviceName) {
        this.entityStore.editDevice({ entityId: deviceId, name: deviceName });
      } else {
        this.modalService.showModalElement(EDIT_DEVICE_ERROR_MODAL);
      }
    }
  }

  protected viewDeviceById(): void {
    const deviceId = this.deviceId();

    if (deviceId) {
      this.routerService.viewDeviceById(deviceId);
    } else {
      this.viewHomescreen();
    }
  }

  private viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }
}
