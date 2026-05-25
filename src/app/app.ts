import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { LoadingIndicator } from './loading-indicator/loading-indicator';
import { Breadcrumb } from './breadcrumb/breadcrumb';
import { NotificationService } from './services/notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, LoadingIndicator, Breadcrumb],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // NOTE: Generating the notification service will generated the initial signal store with default values.
  // The signal store user auth information will be set from the login service when the user logs in.
  private readonly notificationService = inject(NotificationService);
}
