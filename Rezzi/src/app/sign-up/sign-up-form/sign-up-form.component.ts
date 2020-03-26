import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { User } from "src/app/classes.model";
import { HttpClient } from "@angular/common/http";
import { RezziService } from "src/app/rezzi.service";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";

@Component({
  selector: "app-sign-up-form",
  templateUrl: "./sign-up-form.component.html",
  styleUrls: ["./sign-up-form.component.css"]
})
export class SignUpFormComponent implements OnInit {
  hide = true;

  session;
  selectedPicture: File = null;
  firestoreDocument: AngularFirestoreDocument;

  constructor(private rezziService: RezziService, private http: HttpClient) {}

  ngOnInit(): void {
    // Initialize class variables
    this.rezziService.getSession().then(__session => {
      this.session = __session;
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
      0
    );

    console.log(user);

    this.addUser(user);
    /*
    console.log(this.newUser);
    // check that email doesn't exist in database

    if (this.newUser.password !== this.newUser.confirmPassword) {
       alert('Your passwords do not match');
    } else {
      this.userCreatedHD.emit(this.newUser);
       // create account
       // send data to backend
       // account created successfully
    }*/
  }

  addUser(user: User) {
    this.http
      .post<{ notification: string }>("/sign-up/api/sign-up", user)
      .subscribe(responseData => {
        //console.log(responseData.notification);
        alert(responseData.notification); // conley-edit-here
        // if success go home else show message indicating error
      });
  }

  onPictureSelected(event) {
    const file = <File>event.target.files[0];
    if (!file.type.startsWith("image")) {
      this.selectedPicture = null;
      alert("Please upload an image file");
    } else {
      this.selectedPicture = file;
    }
  }
  onUpload(value) {
    let fileToUpload: File = null;
    let progressId: string = null;

    // Set constants based on which file the user is uploading
    if (value == "image") {
      fileToUpload = this.selectedPicture;
      progressId = "pic_";
    } else {
      alert("Something went wrong while uploading; please try again later.");
      return;
    }

    if (fileToUpload === null) {
      alert("Please upload image file");
    } else {
      // document.getElementById(`${progressId}progress`).hidden = false;
      // document.getElementById(`${progressId}bar`).hidden = false;
      const formData = new FormData();
      formData.append(value, fileToUpload, fileToUpload.name);

      // https://angular.io/guide/http#reading-the-full-response
      this.http
        .post(
          "https://us-central-rezzi-33137.cloudfunctions.net/uploadFile",
          formData,
          {
            observe: "response"
          }
        )
        .subscribe(response => {
          if (response.status == 200) {
            location.reload();
          } else {
            alert(
              `Something went wrong. Return with a status code ${response.status}: ${response.statusText}`
            );
          }
        });
    }
  }
}
