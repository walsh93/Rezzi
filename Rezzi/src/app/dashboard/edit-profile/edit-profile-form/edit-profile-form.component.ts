import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { firestore } from 'firebase';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-profile-form',
  templateUrl: './edit-profile-form.component.html',
  styleUrls: ['./edit-profile-form.component.css']
})
export class EditProfileFormComponent implements OnInit {
  hide = true;
  // fetch user data
  // use "double b"
  onEditProfile(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // if(form.value.age)
    // return;
    console.log(form);
    var userInfo = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      age: form.value.age,
      major: form.value.major,
      nickName: form.value.nickName,
      bio: form.value.bio
    }
    /* Katarina - This is all the form data:
      form.value.password,
      form.value.firstName,
      form.value.lastName,
      form.value.age,
      form.value.major,
      form.value.nickName,
      form.value.bio,
    */

    this.editUser(userInfo);

  }

  constructor(private http: HttpClient) { }

  editUser(data) {
    this.http.post<{notification: string}>('http://localhost:4100/dashboard/api/edit-profile', data)
      .subscribe(responseData => {
        console.log(responseData.notification);
      });
  }

  ngOnInit(): void {
  }

}
