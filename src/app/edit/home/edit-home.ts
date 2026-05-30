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
  EDIT_HOME_ERROR_MODAL,
  INVALID_HOME_ID_ERROR_MODAL,
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
  templateUrl: './edit-home.html',
  styleUrl: './edit-home.scss',
})
export class EditHome implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly entityStore = inject(EntityStore);
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);

  protected homeId = signal<number | null>(null);

  private homeInfo = computed(() => {
    const homeId = this.homeId();
    if (homeId) {
      return this.entityStore.homes()[homeId];
    } else {
      return null;
    }
  });

  protected form!: FormGroup;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('homeId'));

    if (isNaN(id)) {
      // If the value provided for the homeId is not a number, route the user to the
      // homescreen. No home data can be received if a valid home ID is not provided.
      const editHomeInvalidHomeIDErrorActions: IModalActions = {
        primaryAction: () => this.viewHomescreen(),
      };
      this.modalService.showModalElement(
        INVALID_HOME_ID_ERROR_MODAL,
        editHomeInvalidHomeIDErrorActions,
      );
      this.homeId.set(null);
    } else {
      this.homeId.set(id);
      this.entityStore.resetNotificationState();
      this.setSuccessEffects();
      this.setErrorEffects();
      this.verifyHomeInfoSet();
    }
  }

  private setSuccessEffects(): void {
    effect(() => {
      const success: EntityActions = this.entityStore.successNotification();

      if (success === 'edit-home') {
        this.viewHomeById();
      }
    });
  }

  private setErrorEffects(): void {
    effect(() => {
      const error: EntityActions = this.entityStore.errorNotification();

      if (error === 'get-view-home-info') {
        this.viewHomescreen();
      }
    });
  }

  private verifyHomeInfoSet(): void {
    effect(() => {
      const homeId = this.homeId();

      if (homeId) {
        const homeInfoVerification = this.entityStore.homes()[homeId];

        if (!homeInfoVerification?.details) {
          this.entityStore.getViewHomeInfo(homeId); // Get the home info if not set in the signal store.
        }
      }
    });

    effect(() => {
      this.form.patchValue({ homeName: this.homeInfo()?.details?.homeName });
    });
  }

  ngOnInit(): void {
    this.entityStore.setPageMode('EDIT');

    this.form = new FormGroup({
      homeName: new FormControl('', [Validators.required]),
    });
  }

  protected update(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const homeName = this.form.get('homeName')?.value || '';

      const homeId = this.homeId();
      if (homeId && homeName) {
        this.entityStore.editHome({ entityId: homeId, name: homeName });
      } else {
        this.modalService.showModalElement(EDIT_HOME_ERROR_MODAL);
      }
    }
  }

  protected viewHomeById(): void {
    const homeId = this.homeId();

    if (homeId) {
      this.routerService.viewHomeById(homeId);
    } else {
      this.viewHomescreen();
    }
  }

  private viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }
}
