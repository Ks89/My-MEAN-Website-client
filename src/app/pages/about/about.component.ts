import { Component } from '@angular/core';

@Component({
  selector: 'mmw-about-page',
  templateUrl: 'about.html'
})
export class AboutComponent {
  pageHeader: any;

  constructor() {
    this.pageHeader = {
      title: 'About',
      strapline: ''
    };
  }
}
