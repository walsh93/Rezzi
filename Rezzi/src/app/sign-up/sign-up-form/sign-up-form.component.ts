import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/classes.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RezziService } from 'src/app/rezzi.service';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent implements OnInit {
  hide = true;

  session: any;
  selectedPicture: File = null;

  profilePic: string;

  constructor(private rezziService: RezziService, private http: HttpClient, private router: Router) {}

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
      //document.getElementById("profile-picture").setAttribute("src", user.image_url);
    } else{
      user.setImageUrl('../../../../src/assets/images/logoSmall.png');
    }

    this.addUser(user);


  }

  addUser(user: User) {
    this.http.post<{ status: number, notification: string }>('/sign-up/api/sign-up', user).toPromise().then(response => {
      alert(response.notification); // conley-edit-here
      if (response.status === 201) {
        this.router.navigate(['/home']);
      }
    });
  }

  onPictureSelected(event) {
    const file = event.target.files[0] as File;
    if (!file.type.startsWith('image')) {
      this.selectedPicture = null;
      alert('Please upload an image file');
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
      alert('Something went wrong while uploading; please try again later.');
      return;
    }

    if (fileToUpload === null) {
      alert('Please upload image file');
    } else {
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
          alert(`Your photo has been uploaded...`);
        } else {
          alert(`Something went wrong. Return with a status code ${response.status}: ${response.statusText}`);
        }
      });
    }

  }
}
