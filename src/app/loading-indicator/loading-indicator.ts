import { Component, inject, Signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { LoadingService } from '../services/loading';
import { LoadingInterface } from '../model/loading';

@Component({
  selector: 'loading-indicator',
  imports: [MatProgressSpinner],
  templateUrl: './loading-indicator.html',
  styleUrl: './loading-indicator.scss',
})
export class LoadingIndicator {
  private readonly loadingService = inject(LoadingService);

  protected loadingStatus: Signal<LoadingInterface> = this.loadingService.getLoadingStatus();
}
