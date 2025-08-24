import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Subscription } from 'rxjs';
import { ILoginResponse } from '../model/login.interface';

@Component({
  selector: 'home-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  greetingMessage!: string;
  userFirstName!: string;

  constructor(private readonly loginService: LoginService) {}

  ngOnInit(): void {
    // Get the user's first name.
    this.subscriptions.push(
      this.loginService.getUserLoginInfo().subscribe({
        next: (loginInfo: ILoginResponse) => {
          this.userFirstName = this.formatName(loginInfo.firstName);

          // Get the current hour and set the greeting message.
          const currentDate = new Date();
          const currentHour = currentDate.getHours();
          this.greetingMessage = this.setGreetingMessage(currentHour);
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formatName(name: string): string {
    let formattedName = name.toLowerCase();
    formattedName = name.charAt(0).toUpperCase() + name.substring(1);
    return formattedName;
  }

  setGreetingMessage(currentHour: number): string {
    if (currentHour >= 0 && currentHour <= 11) {
      return 'Good Morning ' + this.userFirstName + '!';
    } else if (currentHour >= 12 && currentHour <= 4) {
      return 'Good Afternoon ' + this.userFirstName + '!';
    } else {
      return 'Good Evening ' + this.userFirstName + '!';
    }
  }
}
