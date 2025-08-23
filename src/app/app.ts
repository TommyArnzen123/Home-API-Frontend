import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeHeader } from './header/home-header';
import { HomeFooter } from './footer/home-footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeHeader, HomeFooter],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
