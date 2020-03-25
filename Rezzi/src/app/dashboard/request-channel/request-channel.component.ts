import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-channel',
  styleUrls: ['./request-channel.component.css'],

  // Pass data to child via data binding (replaces templateUrl and the HTML file)
  template: `
    <div class="container">
      <h1>Let's request a new channel!</h1>
      <app-request-channel-form></app-request-channel-form>
    </div>
  `
})
export class RequestChannelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
