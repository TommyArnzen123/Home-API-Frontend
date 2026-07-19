import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'delete-button-element',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './delete-button-element.html',
  styleUrl: './delete-button-element.scss',
})
export class DeleteButtonElement {
  // A button action must always be provided as a delete button with no action
  // serves no purpose.
  readonly action = input.required<(() => void) | undefined>();
  readonly buttonText = input<string>('Delete');

  // Execute the provided action.
  protected handleClick(): void {
    this.action()?.();
  }
}
