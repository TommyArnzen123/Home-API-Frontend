import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeHeader } from './header/home-header';
import { HomeFooter } from './footer/home-footer';
import { LoadingComponent } from './loading-component/loading-component';
import { Breadcrumb } from './breadcrumb/breadcrumb';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeHeader, HomeFooter, LoadingComponent, Breadcrumb],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
