import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pwordreset-request',
  templateUrl: './pwordreset-request.component.html',
  styleUrls: ['./pwordreset-request.component.css']
})
export class PwordresetRequestComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onResetPassword(){
    // Source: CS307 project https://github.com/kbaihoff/CheckedIn
    // Get value of input fields (https://stackoverflow.com/questions/12989741/the-property-value-does-not-exist-on-value-of-type-htmlelement)
    const email = (<HTMLInputElement>document.getElementById("email")).value;

    // Body of the HTTP request (param names MUST match input field form names expected in addRepresentative.js)
    const body = `email=${email}`;

    // Create XML HTTP Request
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "pword-reset-request", true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    /**
     * Call a function when the state changes.
     * Get response from server (addRepresentative.js), where the responseText is either an error message or the next URL
     * Successful signup = 202: xhr.responseText = <new URL to route to>
     * Bad credentials = 401, xhr.responseText = <error message>
     * Need credentials = 403, xhr.responseText = <welcome page URL>
     * Firebase error = 500, xhr.responseText = <error message>
     */
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        console.log(xhr.status);
        if (xhr.status === 200 || xhr.status === 403) {
          window.location.href = xhr.responseText;
        } else if (xhr.status === 401 || xhr.status === 500) {
          alert(xhr.responseText);
        } else {
          console.log(xhr.status);
          alert('Your POST request received an unhandled response code.');
        }
      }
    };

    // Send the request
    xhr.send(body);
  }

}
