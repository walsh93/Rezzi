import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/classes.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RezziService } from 'src/app/rezzi.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent implements OnInit {
  hide = true;
  addedPhoto = false;
  duringUpload = false;
  session: any;
  selectedPicture: File = null;

  profilePic: string;

  constructor(private rezziService: RezziService,
              private http: HttpClient,
              private router: Router,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Initialize class variables
    this.rezziService.getSession().then(session => {
      this.session = session;
    });

  }

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // if(form.value.age)
    // return;
    const user = new User(
      this.session.email,
      form.value.password,
      form.value.firstName,
      form.value.lastName,
      form.value.age,
      form.value.major,
      form.value.nickName,
      form.value.bio,
      true,
      0,
      this.profilePic,
    );
    if (user.image_url) {
      user.setImageUrl(user.image_url);
      // document.getElementById("profile-picture").setAttribute("src", user.image_url);
    } else if (this.addedPhoto === false) {
      user.setImageUrl('https://firebasestorage.googleapis.com/v0/b/rezzi-33137.appspot.com/o/uploaded-images%2Fblank2.jpg?alt=media&token=d40de5df-1825-4140-b851-658296d68eac');
    }


    this.addUser(user);


  }

  addUser(user: User) {
    this.http.post<{ status: number, notification: string }>('/sign-up/api/sign-up', user).toPromise().then(response => {
      // alert(response.notification); // conley-edit-here
      if (response.status === 201) {
        this.router.navigate(['/home']);
      }
    });
  }

  onPictureSelected(event) {
    const file = event.target.files[0] as File;
    if (!file.type.startsWith('image')) {
      this.selectedPicture = null;
      this.snackBar.open('Please upload an image file');
    } else {
      this.selectedPicture = file;
    }
  }

  onUpload(value) {

    let fileToUpload: File = null;
    let progressId: string = null;

    // Set constants based on which file the user is uploading
    if (value === 'image') {
      fileToUpload = this.selectedPicture;
      progressId = 'pic_';
    } else {
      this.snackBar.open('Something went wrong while uploading; please try again later.');
      return;
    }

    if (fileToUpload === null) {
      this.snackBar.open('Please upload image file');
    } else {
      this.duringUpload = true;
      // document.getElementById(`${progressId}progress`).hidden = false;
      // document.getElementById(`${progressId}bar`).hidden = false;
      const formData = new FormData();
      formData.append(value, fileToUpload, fileToUpload.name);
      this.http.post(
        `https://us-central1-rezzi-33137.cloudfunctions.net/uploadFile?docId=${this.session.email}`,
        formData,
        { observe: 'response' }
      ).subscribe(response => {
        if (response.status === 200) {
          // location.reload();
          this.duringUpload = false;
          this.snackBar.open(`Your photo has been uploaded...`);
          this.addedPhoto = true;
        } else {
          this.snackBar.open(`Something went wrong. Return with a status code ${response.status}: ${response.statusText}`);
        }
      });
    }

  }
}
