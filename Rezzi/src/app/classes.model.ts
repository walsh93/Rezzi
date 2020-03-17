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
    password: string,
    firstName: string,
    lastName: string,
    age: number,
    major: string,
    nickName: string,
    bio: string,
  ) {
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.major = major;
    this.nickName = nickName;
    this.bio = bio;
  }

  updateUser(
    newPassword: string,
    newFirstName: string,
    newLastName: string,
    newAge: number,
    newMajor: string,
    newNickName: string,
    newBio: string,
  ) {
    this.password = newPassword;
    this.firstName = newFirstName;
    this.lastName = newLastName;
    this.age = newAge;
    this.major = newMajor;
    this.nickName = newNickName;
    this.bio = newBio;
  }
}

export interface Message {
  id: string;
  // owner: User;
  content: string;
  time: Date;
  visible: boolean;
}

export interface SocketMessageData {
  message: Message;
}

export interface SocketChannelMessageData extends SocketMessageData {
  rezzi: string;
  channelID: string;
}

export interface SocketPrivateMessageData extends SocketMessageData {
  recipient: string;  // TODO ??
  sender: string;
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
export interface ChannelData {
  id: string;
  channel: string;
  users: number;
  belongs: boolean;
  subchannels: ChannelData[];
  messages: Message[];
}

export interface PrivateMessageData {
  recipient: string;
  messages: Message[];
}
