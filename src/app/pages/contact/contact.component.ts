import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { EmailValidators } from 'ng2-validators';

import { ContactService } from '../../core/services/services';

@Component({
  selector: 'mmw-contact-page',
  templateUrl: 'contact.html'
})
export class ContactComponent implements OnDestroy {

  pageHeader: any;
  formModel: FormGroup;
  contactAlert: any = { visible: false }; // hidden by default
  isWaiting = false; // enable button's spinner
  showFormError = false;

  private sendFormSubscription: Subscription;
  private recaptchaResponse: any;

  constructor(private contactService: ContactService) {
    this.pageHeader = {
      title: 'Contact',
      strapline: ''
    };

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'email': [null, EmailValidators.simple],
      'subject': [null, Validators.minLength(4)],
      'message': [null, Validators.minLength(15)],
    });
  }

  handleCorrectCaptcha(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);
    this.recaptchaResponse = captchaResponse;
  }

  onSend() {
    if (!this.formModel.valid) {
      return;
    }
    this.isWaiting = true;
    console.log('Sending email...');
    console.log(this.formModel.value);
    let dataToSend = {
        response: this.recaptchaResponse,
        emailFormData: {
          email : this.formModel.value.email,
          messageText : this.formModel.value.message,
          object : this.formModel.value.subject
        }
    };
    this.sendFormSubscription = this.contactService.sendFormWithCaptcha(dataToSend)
      .subscribe(
        (response: any) => {
          console.log('/api/email called -> OK');
          console.log(response);
          this.contactAlert = {
            visible: true,
            status: 'success',
            strong : 'Success',
            message: response['message']
          };
          this.isWaiting = false;
          this.showFormError = false;
        },
        err => {
          console.log('/api/email called -> ERROR');
          console.error(err);
          this.contactAlert = {
            visible: true,
            status: 'danger',
            strong : 'Error',
            message: err.message
          };
          this.isWaiting = false;
          this.showFormError = true;
        },
        () => console.log('Done')
      );
  }

  ngOnDestroy(): any {
    if (this.sendFormSubscription) {
      this.sendFormSubscription.unsubscribe();
    }
  }
}
