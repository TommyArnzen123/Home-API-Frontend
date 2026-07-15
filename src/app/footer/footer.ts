import { Component } from '@angular/core';

@Component({
  selector: 'footer',
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected currentYear = new Date().getFullYear();
}
