import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pwordreset-change',
  templateUrl: './pwordreset-change.component.html',
  styleUrls: ['./pwordreset-change.component.css']
})
export class PwordresetChangeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onReset(){
    //Source: CS307 project https://github.com/kbaihoff/CheckedIn
    // Get value of input fields (https://stackoverflow.com/questions/12989741/the-property-value-does-not-exist-on-value-of-type-htmlelement)
    const password = (<HTMLInputElement>document.getElementById("password")).value; 


    // Body of the HTTP request (param names MUST match input field form names expected in addRepresentative.js)
    const body = `password=${password}`;

    // Create XML HTTP Request
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "pword-reset-change", true);

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
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        console.log(xhr.status)
        if (xhr.status == 200 || xhr.status == 403) {
          window.location.href = xhr.responseText;
        } else if (xhr.status == 401 || xhr.status == 500) {
          alert(xhr.responseText);
        } else {
          console.log(xhr.status)
          alert("Your POST request received an unhandled response code.");
        }
      }
    }

    // Send the request
    xhr.send(body);
  
  }

}