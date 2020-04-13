import { Component, OnInit, Output, EventEmitter, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { RezziService } from 'src/app/rezzi.service';
import { NgForm } from '@angular/forms';
import { PollInfo, PollResponses, Message, AbbreviatedUser } from '../../../../classes.model'
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-polling',
  templateUrl: './polling.component.html',
  styleUrls: ['./polling.component.css']
})
export class PollingComponent implements OnInit {
  responses = [
    {
      id: 0,
      response: 'Response'
    },
    {
      id: 1,
      response: 'Response'
    }
  ];

  @Output() public create_poll = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<PollingComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private rezziService: RezziService,
    private http: HttpClient) { }


  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createPoll(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form);
    let newform2 = this.generateForm(form);
    console.log(newform2);
    const pollInfo: PollInfo = {
      responses: newform2,
      question: form.value.question,
      users: []
    }
    const message: Message = {
      content: '',
      owner: null,
      time: new Date(),
      visible: true,
      id: null, // TODO Need to change the ID
      reactions: { // TODO should make this more generic for ReactionData so its easier to add icons
        thumb_up: [],
        thumb_down: [],
        sentiment_very_satisfied: [],
        sentiment_dissatisfied: [],
        whatshot: [],
      },
      reported: false,
      image: null, //should this not be null?
      isPoll: true,
      pollInfo: pollInfo,

    };

    this.create_poll.emit(message);

    //form should have list of users who have submitted
    //each response should have a number that increments
    //form
    this.dialogRef.close();
  }

  generateForm(form: NgForm) {
    let response0: PollResponses = {
      count: 0,
      content: form.value.response0
    }
    let response1: PollResponses = {
      count: 0,
      content: form.value.response1
    }
    let newform: PollResponses[] = [];

    if (form.value.response2 == null || form.value.response2 == undefined) {
      console.log("2 items");
      newform.push(response0);
      newform.push(response1);
    }
    else if (form.value.response3 == null || form.value.response3 == undefined) {
      console.log("3 items");
      let response2: PollResponses = {
        count: 0,
        content: form.value.response2
      }
      newform.push(response0);
      newform.push(response1);
      newform.push(response2);
    }
    else {
      console.log("4 items");
      let response2: PollResponses = {
        count: 0,
        content: form.value.response2
      }
      let response3: PollResponses = {
        count: 0,
        content: form.value.response3
      }
      newform.push(response0);
      newform.push(response1);
      newform.push(response2);
      newform.push(response3);
    }
    return newform;
  }

  addResponse() {
    let to_add = {
      id: -1,
      response: 'Example Response',
    }
    if (this.responses.length == 2) {
      to_add.id = 2;
    }
    else {
      to_add.id = 3;
    }
    this.responses.push(to_add);

    /*
    let temp_id = this.floors.length;
    if (this.floor_empty_ids.length > 0) {
      temp_id = this.floor_empty_ids.pop();
    }
    this.floors.push({
      id: temp_id,
      name: 'Example Floor Name',
      channels: [
        {
          id: 0,
          name: 'General',
          // default: true
        },
      ]
    })*/
  }

  deleteResponse() {
    let index = this.responses.length;
    this.responses.splice(index - 1, 1);

    /*
    let index = this.floors.findIndex((floor) => {
      return floor.id === floor_id;
    });
    this.floors.splice(index, 1);
    this.floor_empty_ids.push(floor_id);
    */
  }

}
