import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

import { AuthService } from '../../shared/services/services';

@Component({
  selector: 'mmw-login-page',
  styleUrls: ['login.scss'],
  templateUrl: 'login.html'
})
export class LoginComponent {
  public pageHeader: any;
  public formModel: FormGroup;
  public loginAlert: any = { visible: false }; // hidden by default
  public isWaiting: boolean = false; // enable button's spinner
  public showFormError: boolean = false;

  public facebookOauthUrl: string = 'api/auth/facebook';
  public googleOauthUrl: string = 'api/auth/google';
  public githubOauthUrl: string = 'api/auth/github';
  public linkedinOauthUrl: string = 'api/auth/linkedin';
  public twitterOauthUrl: string = 'api/auth/twitter';

  constructor(private authService: AuthService, private router: Router) {
    this.pageHeader = {
      title: 'Sign in',
      strapline: ''
    };

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'email': [null, null],
      'password': [null, null]
    });
  }

  onLogin() {
    if (this.formModel.valid) {
      this.isWaiting = true;
      console.log('Calling login...');
      this.authService.login({
        email: this.formModel.value.email,
        password: this.formModel.value.password
      }).subscribe(
        response => {
          console.log('Response login');
          console.log(response);
          this.isWaiting = false;
          this.authService.getLoggedUser().subscribe(
            result => {

              console.log('**************************');
              console.log(result);
              console.log('**************************');

              this.loginAlert = {
                visible: true,
                status: 'success',
                strong : 'Success',
                message: result.message
              };
              this.authService.loginEvent.emit(result);
              this.router.navigate(['/profile']);
            },
            err => {
              console.error(err);
              this.loginAlert = {
                visible: true,
                status: 'danger',
                strong : 'Error',
                message: JSON.parse(err._body).message
              };
              this.isWaiting = false;
              this.showFormError = true;
            },
            () => console.log('Done')
          );
        },
        err => {
          console.error(err);
          this.loginAlert = {
            visible: true,
            status: 'danger',
            strong : 'Error',
            message: JSON.parse(err._body).message
          };
          this.isWaiting = false;
          this.showFormError = true;
        },
        () => console.log('Done')
      );
    }
  }
}
