export class User {
  email: string;
  password: string; // stored as hash in database
  firstName: string;
  lastName: string;
  age: number;
  major: string;
  nickName: string;
  bio: string;
  verified: boolean;

  constructor(
    theEmail: string,
    thePassword: string,
    theFirstName: string,
    theLastName: string,
    theAge: number,
    theMajor: string,
    theNickName: string,
    theBio: string,
    theVerified: boolean
  ) {
    this.email = theEmail;
    this.password = thePassword;
    this.firstName = theFirstName;
    this.lastName = theLastName;
    this.age = theAge;
    this.major = theMajor;
    this.nickName = theNickName;
    this.bio = theBio;
    this.verified = theVerified;

  }
}

export interface Message {
  id: string;
  // owner: User;
  content: string;
  // time: Date;
  // visible: boolean;
}

export class HDUser {
  constructor(firstName: string, lastName: string, email: string, password: string, verified: boolean) {
    this.firstName = firstName;
    this. lastName = lastName;
    this.email = email;
    this.password = password;
    this.accountType = 0;
    this.verified = verified;
  }
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: number;
  verified: boolean;
}
