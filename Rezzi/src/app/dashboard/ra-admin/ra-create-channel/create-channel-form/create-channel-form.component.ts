import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-channel-form',
  templateUrl: './create-channel-form.component.html',
  styleUrls: ['./create-channel-form.component.css']
})
export class CreateChannelFormComponent implements OnInit {

  // Class variables
  errorMsg: string;

  // Parent variables
  @Input() owner: string;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // Initialize class variables
    this.errorMsg = '';
  }

  plus() {
    // Get element references
    const memberInputs = document.getElementById('members-to-add');
    const memberLabel = document.getElementsByClassName('member-label')[0];
    const lastInput = document.getElementsByClassName('member-input')[0];

    // Clone and set attributes (clone label for alignment)
    const labelClone = memberLabel.cloneNode(true) as HTMLElement;  // copy node and child elements
    const inputClone = lastInput.cloneNode(true) as HTMLElement;
    labelClone.textContent = '';
    (inputClone.lastChild as HTMLButtonElement).addEventListener('click', this.plus.bind(this));  // .bind() sets scope

    // Append cloned elements
    memberInputs.appendChild(labelClone);
    memberInputs.appendChild(inputClone);
  }

  createChannel() {
    console.log("create");
  }

}
