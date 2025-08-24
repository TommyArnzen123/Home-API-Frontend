import { Component } from '@angular/core';

@Component({
  selector: 'home-footer',
  imports: [],
  templateUrl: './home-footer.html',
  styleUrl: './home-footer.scss',
})
export class HomeFooter {
  currentYear = new Date().getFullYear();
}
