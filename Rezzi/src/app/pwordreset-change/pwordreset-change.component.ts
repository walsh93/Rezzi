import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/classes.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pwordreset-change',
  templateUrl: './pwordreset-change.component.html',
  styleUrls: ['./pwordreset-change.component.css']
})
export class PwordresetChangeComponent implements OnInit {
  hide = true;
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  onReset(form: NgForm) {
    // Source: CS307 project https://github.com/kbaihoff/CheckedIn
    // Get value of input fields (https://stackoverflow.com/questions/12989741/the-property-value-does-not-exist-on-value-of-type-htmlelement)
    const password = form.value.password;


    // Body of the HTTP request (param names MUST match input field form names expected in addRepresentative.js)
    const body = `password=${password}`;

    // Create XML HTTP Request
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'pword-reset-change', true);

    // Send the proper header information along with the request
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

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
          this.router.navigate([xhr.responseText]); // TODO this currently doesn't work, may need to implement sessions and do a refresh
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
