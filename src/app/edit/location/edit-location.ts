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
  EDIT_LOCATION_ERROR_MODAL,
  INVALID_LOCATION_ID_ERROR_MODAL,
} from '../../constants/error-constants';
import { IModalActions } from '../../model/modal';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'edit-home',
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
  templateUrl: './edit-location.html',
  styleUrl: './edit-location.scss',
})
export class EditLocation implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly entityStore = inject(EntityStore);
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);

  protected locationId = signal<number | null>(null);

  private locationInfo = computed(() => {
    const locationId = this.locationId();
    if (locationId) {
      return this.entityStore.locations()[locationId];
    } else {
      return null;
    }
  });

  protected form!: FormGroup;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('locationId'));

    if (isNaN(id)) {
      // If the value provided for the locationId is not a number, route the user to the
      // homescreen. No location data can be received if a valid location ID is not provided.
      const editLocationInvalidLocationIDErrorActions: IModalActions = {
        primaryAction: () => this.viewHomescreen(),
      };
      this.modalService.showModalElement(
        INVALID_LOCATION_ID_ERROR_MODAL,
        editLocationInvalidLocationIDErrorActions,
      );
      this.locationId.set(null);
    } else {
      this.locationId.set(id);
      this.entityStore.resetNotificationState();
      this.setSuccessEffects();
      this.setErrorEffects();
      this.verifyLocationInfoSet();
    }
  }

  private setSuccessEffects(): void {
    effect(() => {
      const success: EntityActions = this.entityStore.successNotification();

      if (success === 'edit-location') {
        this.viewLocationById();
      }
    });
  }

  private setErrorEffects(): void {
    effect(() => {
      const error: EntityActions = this.entityStore.errorNotification();

      if (error === 'get-view-location-info') {
        this.viewHomescreen();
      }
    });
  }

  private verifyLocationInfoSet(): void {
    effect(() => {
      const locationId = this.locationId();

      if (locationId) {
        const locationInfoVerification = this.entityStore.locations()[locationId];

        if (!locationInfoVerification?.details) {
          this.entityStore.getViewLocationInfo(locationId); // Get the location info if not set in the signal store.
        }
      }
    });

    effect(() => {
      this.form.patchValue({ locationName: this.locationInfo()?.details?.locationName });
    });
  }

  ngOnInit(): void {
    this.entityStore.setPageMode('EDIT');

    this.form = new FormGroup({
      locationName: new FormControl('', [Validators.required]),
    });
  }

  protected update(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const locationName = this.form.get('locationName')?.value || '';

      const locationId = this.locationId();
      if (locationId && locationName) {
        this.entityStore.editLocation({ entityId: locationId, name: locationName });
      } else {
        this.modalService.showModalElement(EDIT_LOCATION_ERROR_MODAL);
      }
    }
  }

  protected viewLocationById(): void {
    const locationId = this.locationId();

    if (locationId) {
      this.routerService.viewLocationById(locationId);
    } else {
      this.viewHomescreen();
    }
  }

  private viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }
}
