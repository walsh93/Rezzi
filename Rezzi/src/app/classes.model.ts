// import { emit } from "cluster";

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

  setUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    age: number,
    major: string,
    nickName: string,
    bio: string,
    verified: boolean
  ) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.major = major;
    this.nickName = nickName;
    this.bio = bio;
    this.verified = verified;
  }

  updateUser(
    newEmail: string,
    newPassword: string,
    newFirstName: string,
    newLastName: string,
    newAge: number,
    newMajor: string,
    newNickName: string,
    newBio: string,
    newVerified: boolean
  ) {
    this.email = newEmail;
    this.password = newPassword;
    this.firstName = newFirstName;
    this.lastName = newLastName;
    this.age = newAge;
    this.major = newMajor;
    this.nickName = newNickName;
    this.bio = newBio;
    this.verified = newVerified;
  }
}

export interface Message {
  id: string;
  // owner: User;
  content: string;
  // time: Date;
  // visible: boolean;
}

export interface ChannelData {
  id: string;
  channel: string;
  users: number;
  belongs: boolean;
  subchannels: ChannelData[];
}
