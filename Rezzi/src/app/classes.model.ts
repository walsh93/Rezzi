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
  deletionRequest: number;

  constructor(
    theEmail: string,
    thePassword: string,
    theFirstName: string,
    theLastName: string,
    theAge: number,
    theMajor: string,
    theNickName: string,
    theBio: string,
    theVerified: boolean,
    deletionRequest: number
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
    this.deletionRequest = deletionRequest;
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

export interface ReactionData {
  thumb_up: string[];
  thumb_down: string[];
  sentiment_very_satisfied: string[];
  sentiment_dissatisfied: string[];
  whatshot: string[];
}

export class AbbreviatedUser {
  email: string;
  firstName: string;
  lastName: string;
  nickName: string;

  constructor(email: string, fname: string, lname: string, nick: string) {
    this.email = email;
    this.firstName = fname;
    this.lastName = lname;
    this.nickName = nick;
  }
}

export interface Message {
  id: string;
  owner: AbbreviatedUser;
  content: string;
  time: Date;
  visible: boolean;
  reactions: ReactionData;
  image: string;
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
  constructor(firstName: string, lastName: string, email: string, password: string, verified: boolean, deletionRequests: String[]) {
    this.firstName = firstName;
    this. lastName = lastName;
    this.email = email;
    this.password = password;
    this.accountType = 0;
    this.verified = verified;
    this.deletionRequests = deletionRequests;

  }
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: number;
  verified: boolean;
  deletionRequests: String[];
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
