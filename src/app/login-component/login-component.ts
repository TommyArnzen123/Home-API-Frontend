import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatError } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { ILoginResponse } from '../model/login.interface';
import { SessionStorageService } from '../services/session-storage.service';
import { JWT_TOKEN } from '../constants/session-storage-constants';
import { Router } from '@angular/router';
import { APP_ROOT_ROUTE } from '../constants/navigation-constants';

@Component({
  selector: 'home-login-component',
  imports: [MatCard, MatCardTitle, MatCardContent, MatFormField, MatInput, MatError, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss'
})
export class LoginComponent {

  constructor(
    private readonly loginService: LoginService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly router: Router,
  ) {}

  error!: string;
  
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  login() {
    if (this.form.valid) {
      const username = this.form.get('username')?.value;
      const password = this.form.get('password')?.value;
      this.loginAction(username, password);
    } else {
      this.error = 'There was an error logging in.';
    }
  }

  register() {
    console.log('Register New User');
  }

  loginAction(usernameValue: string, passwordValue: string) {
    this.loginService.login({username: usernameValue, password: passwordValue}).subscribe({
      next: (response: ILoginResponse) => {
        if (response) {
          this.sessionStorageService.setItem(JWT_TOKEN, response.jwtToken);
          this.router.navigateByUrl(APP_ROOT_ROUTE);
        }
      },
      error: () => {
        console.log("There was an error in the network call.");
      }
    });
  }

}
