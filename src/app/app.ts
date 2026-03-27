import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { LoadingComponent } from './loading-indicator/loading-indicator';
import { Breadcrumb } from './breadcrumb/breadcrumb';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, LoadingComponent, Breadcrumb],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
