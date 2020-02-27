import { Component, OnInit, Input } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-channel-form',
  templateUrl: './create-channel-form.component.html',
  styleUrls: ['./create-channel-form.component.css']
})
export class CreateChannelFormComponent implements OnInit {

  // Class variables
  numMembers: number;
  errorMsg: string;
  title: string;
  description: string;
  levelSelection: string;

  // Parent variables
  @Input() owner: string;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // Initialize class variables
    this.numMembers = 1;
    this.errorMsg = '';
    this.title = '';
    this.description = '';
    this.levelSelection = 'floor';  // Checked by default on start
  }

  /**
   * https://www.youtube.com/watch?v=Wo9nfK2fEyw
   * @param event - the event that triggered this function (button change)
   */
  radioSwitch(event) {
    this.levelSelection = event.target.value;
  }

  plus() {
    if (this.numMembers > 19) {
      alert('You can add a maximum of 20 members to start');
    } else {
      (document.getElementsByClassName('member-label')[this.numMembers] as HTMLElement).hidden = false;
      (document.getElementsByClassName('member-input-column')[this.numMembers] as HTMLElement).hidden = false;
      this.numMembers += 1;
    }
  }

  /**
   * Take form values and put them into a request body to send to the backend.
   * The title and description can be obtained through form.form.value. However, since those inputs
   * were linked to class variables using [(ngModel)], they can also be accessed using those.
   *
   * https://angular.io/guide/form-validation
   *
   * @param form - form being submitted
   */
  createChannel(form: NgForm) {
    if (form.invalid) {
      this.errorMsg = `At least one form field is invalid. Please check that all required inputs are present
        and all given inputs are accepted.`;
      document.getElementById('error-msg').hidden = false;
      return;
    } else {
      document.getElementById('error-msg').hidden = true;
    }

    // Go through all member inputs, filter invalid email formats
    const memberInputs = document.getElementsByName('member');
    const ownerInput = document.getElementsByName('owner');
    const members = new Array<string>();

    ownerInput.forEach((element) => { // This should only run once
      const ownerEmail = (element as HTMLInputElement).value;
      if (ownerEmail.length > 1 && !members.includes(ownerEmail)) {
        members.push(ownerEmail);
      }
    });

    memberInputs.forEach((element) => {
      const memberEmail = (element as HTMLInputElement).value;
      if (memberEmail.length > 1 && !members.includes(memberEmail) && this.validateEmail(memberEmail)) {
        members.push(memberEmail);  // Validation happens on the form itself
      }
    });
    console.log(members);

    // Body of the HTTP request (param names MUST match input field form names expected in login.js)
    const body = {
      owner: `${(document.getElementById('owner') as HTMLInputElement).value}`,
      title: `${this.title}`,
      level: `${this.levelSelection}`,
      description: `${this.description}`,
      memberEmails: members,
    };

    /**
     * Send POST request
     * Regardless of whether there was an error or not, the return object can be cast to an HttpErrorResponse
     * If login succeeded (got a 2XX response status from create-channel.js), the then() will execute
     * If login failed (got a 4XX response status from create-channel.js), the catch() will execute
     * Sometimes there is a parsing error in the browser, so a successful login is still "caught"
     * NOTE: Anything returned from create-channel.js will be accessible in res.error
     */
    this.http.post('/create-channel', body).toPromise().then((response) => {
      this.router.navigate(['/home']);  // TODO change this to route to channel?
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status === 200) {
        this.router.navigate(['/home']);  // TODO change this to route to channel?
      } else {
        document.getElementById('error-msg').hidden = false;
        this.errorMsg = `${res.error}`;
      }
    });
  }

  /**
   * Swiped straight from:
   * https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
   */
  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

}
