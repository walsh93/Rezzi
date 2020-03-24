import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { RezziService } from '../../rezzi.service';

@Component({
  selector: 'app-request-channel-form',
  templateUrl: './request-channel-form.component.html',
  styleUrls: ['./request-channel-form.component.css']
})
export class RequestChannelFormComponent implements OnInit {

  // Class variables
  errorMsg: string;
  title: string;
  description: string;
  levelSelection: string;
  rezzi: string;
  floor: string;
  respectiveRa: string = null;

  constructor(private rezziService: RezziService, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    // Initialize class variables
    this.errorMsg = '';
    this.title = '';
    this.description = '';
    this.levelSelection = 'floor';  // Checked by default on start

    // Get floor RA
    this.rezziService.getSession().then((session) => {
      if (session.email == null || session.email === undefined) {  // not signed in
        this.router.navigate(['/sign-in']);
      } else {
        if (session.accountType !== 2) {  // not a resident
          alert('Typically only a resident should access this page...');
        }

        this.rezziService.getUserProfile().then((response) => {
          this.rezzi = response.user.rezzi;
          this.floor = response.user.floor;
          this.rezziService.getRaFromFloor(`${response.user.rezzi}`, `${response.user.floor}`).then((obj) => {
            this.respectiveRa = obj.ra;
          });
        });
      }
    });
  }

  /**
   * https://www.youtube.com/watch?v=Wo9nfK2fEyw
   * @param event - the event that triggered this function (button change)
   */
  radioSwitch(event) {
    this.levelSelection = event.target.value;
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
  requestChannel(form: NgForm) {
    if (form.invalid) {
      this.errorMsg = `At least one form field is invalid. Please check that all required inputs are present
        and all given inputs are accepted.`;
      document.getElementById('error-msg').hidden = false;
      return;
    } else {
      document.getElementById('error-msg').hidden = true;
    }

    // Body of the HTTP request (param names MUST match input field form names expected in login.js)
    const idPrefix = (`${this.levelSelection}` === 'floor') ? `floors-${this.floor}` : 'hallwide';
    const body = {
      channel: {
        owner: `${this.respectiveRa}`,
        title: `${this.title}`,
        level: `${this.levelSelection}`,
        description: `${this.description}`,
      },
      channelID: `${idPrefix}-${this.title}`,
    };

    /**
     * Send POST request
     * Regardless of whether there was an error or not, the return object can be cast to an HttpErrorResponse
     * If login succeeded (got a 2XX response status from request-channel.js), the then() will execute
     * If login failed (got a 4XX response status from request-channel.js), the catch() will execute
     * Sometimes there is a parsing error in the browser, so a successful login is still "caught"
     * NOTE: Anything returned from request-channel.js will be accessible in res.error
     */
    this.http.post(`/request-channel?rezzi=${this.rezzi}&floor=${this.floor}`, body).toPromise().then((response) => {
      console.log(response);
      alert('OKAY!!!');
      this.router.navigate(['/home']);  // TODO change this to route to channel?
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status === 200) {
        console.log(res);
        alert('NO-KAY!!!');
        this.router.navigate(['/home']);  // TODO change this to route to channel?
      } else {
        document.getElementById('error-msg').hidden = false;
        this.errorMsg = `${res.error}`;
      }
    });
  }

}
