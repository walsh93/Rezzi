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
  image_url: string;

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
    deletionRequest: number,
    image_url: string,
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
    this.image_url = image_url;
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
  setImageUrl(image_url: string) {
    this.image_url = image_url;
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

export class Profile {
  email: string;
  firstName: string;
  lastName: string;
  rezzi: string;
  floor: string;
  major: string;
  nickName: string;
  bio: string;
  imageUrl: string;

  constructor(
    email: string,
    firstName: string,
    lastName: string,
    rezzi: string,
    floor: string,
    major: string,
    nickName: string,
    bio: string,
    imageUrl: string,
  ) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.rezzi = rezzi;
    this.floor = floor;
    this.major = major;
    this.nickName = nickName;
    this.bio = bio;
    this.imageUrl = imageUrl;
  }
}

export interface ReactionData {
  thumb_up: string[];
  thumb_down: string[];
  sentiment_very_satisfied: string[];
  sentiment_dissatisfied: string[];
  whatshot: string[];
}

export interface EventData {
  id: string;
  owner: User;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  attending: {
    going: User[];
    interested: User[];
    "not going": User[];
  };
  canceled: boolean;
}

export class AbbreviatedUser {
  email: string;
  firstName: string;
  lastName: string;
  nickName: string;
  image_url: string;

  constructor(email: string, fname: string, lname: string, nick: string, url: string) {
    this.email = email;
    this.firstName = fname;
    this.lastName = lname;
    this.nickName = nick;
    this.image_url = url;
  }
}

export interface Message {
  id: string;
  owner: AbbreviatedUser;
  content: string;
  time: Date;
  visible: boolean;
  reactions: ReactionData;
  reported: boolean;
  image: string;
  event: EventData;
  isPoll: boolean;
  pollInfo: PollInfo;
}

export interface PollInfo {
  responses: PollResponses[];
  question: string;
  users: string[];
}

export interface PollResponses {
  count: number;
  content: string;
}

export enum BotMessage {
  UserHasJoinedChannel = 0,
  UserHasLeftChannel = 1,
  EventHasBeenCanceled = 2,
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
  constructor(firstName: string, lastName: string, email: string, password: string, verified: boolean, deletionRequests: String[], reportedMessages: String[]) {
    this.firstName = firstName;
    this. lastName = lastName;
    this.email = email;
    this.password = password;
    this.accountType = 0;
    this.verified = verified;
    this.deletionRequests = deletionRequests;
    this.reportedMessages = reportedMessages;

  }
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: number;
  verified: boolean;
  deletionRequests: String[];
  reportedMessages: String[];
}

export interface ChannelData {
  id: string;
  channel: string;
  users: number;
  belongs: boolean;
  isMuted: boolean;
  subchannels: ChannelData[];
  messages: Message[];
}

export interface PrivateMessageData {
  recipient: string;
  messages: Message[];
}

export interface ResidentPrivilegeInfo {
  email: string;
  firstName: string;
  lastName: string;
  floor: string;
  accountType: number;
  canPost: boolean;
}

export interface MemberMuteInfo {
  email: string;
  firstName: string;
  lastName: string;
  isMuted: boolean;
}

export interface ChannelMemberData {
  email: string;
  isMuted: boolean;
}

export const IMAGE_BASE_URL = 'https://us-central1-rezzi-33137.cloudfunctions.net';
