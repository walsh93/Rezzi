import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { RezziService } from 'src/app/rezzi.service';
import { NodeSession, AbbreviatedUser, User, UserProfile, AbbreviatedUserProfile, ChannelData } from 'src/app/classes.model';
import { SidePanelService } from './side-panel/side-panel.service';

/**
 * This is the service that can be used by the interface.component and it's child elements. The
 * interface.service employs functions from other specialized services (Rezzi, side panel,
 * messages, etc) and stores data all in one place just for clarity, albeit this may not be
 * necessary.
 */
@Injectable({
  providedIn: 'root'
})
export class InterfaceService {

  // Session data
  private nodeSession: NodeSession = null;
  private nodeSessionSubj = new Subject<NodeSession>();

  // User profile data
  private userProfile: UserProfile = null;
  private userProfileSubj = new Subject<UserProfile>();
  private userProfileAbr: AbbreviatedUserProfile = null;
  private userProfileAbrSubj = new Subject<AbbreviatedUserProfile>();
  private canPost: boolean = null;
  private canPostSubj = new Subject<boolean>();

  // Channel data
  private allChannels: ChannelData[] = [];
  private allChannelsSubj = new Subject<ChannelData[]>();
  private myChannels: ChannelData[] = [];
  private myChannelsMap = new Map<string, ChannelData>();
  private myChannelsSubj = new Subject<ChannelData[]>();
  private newChannelViewSubj = new Subject<string>();
  private isMutedSubj = new Subject<boolean>();

  constructor(private rezzi: RezziService, private sidePanel: SidePanelService) {
    console.log('interface.service constructor run');
    this.initializeNodeSession();
    this.initializeUserData();
    this.initializeChannels();
  }

  /************************************************************************************************
   * Initializer functions
   ***********************************************************************************************/

  private initializeNodeSession() {
    this.rezzi.getSession().then(response => {
      const session = response as NodeSession;
      this.nodeSession = session;
      this.nodeSessionSubj.next(session);
    });
  }

  private initializeUserData() {
    this.rezzi.getUserProfile().then(response => {
      const profile = response.user as UserProfile;
      const profileAbr: AbbreviatedUserProfile = {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        nickName: profile.nickName,
        imageUrl: profile.imageUrl
      };
      this.userProfile = profile;
      this.userProfileAbr = profileAbr;
      this.canPost = profile.canPost;
      this.userProfileSubj.next(profile);
      this.userProfileAbrSubj.next(profileAbr);
      this.canPostSubj.next(profile.canPost);
    });
  }

  private initializeChannels() {
    this.sidePanel.getChannels().then(arrays => {
      this.allChannels = arrays.allChannels;
      this.myChannels = arrays.myChannels;
      arrays.myChannels.forEach(channelData => {
        this.myChannelsMap.set(channelData.id, channelData);
      });
    });
  }

  /************************************************************************************************
   * Getter functions
   ***********************************************************************************************/

  /**
   * Get the interface.service session
   * Will be called by the interface.component and CHILD elements of the interface.component if the
   * session has already been initialized.
   */
  getNodeSession(): NodeSession {
    return this.nodeSession;
  }

  /**
   * Get the interface.service session listener
   * Will be called by the interface.component and CHILD elements of the interface.component if the
   * session has not yet been initialized.
   */
  getNodeSessionListener(): Observable<NodeSession> {
    return this.nodeSessionSubj.asObservable();
  }

  /**
   * Get the user profile
   * Will be called by the interface.component and CHILD elements of the interface.component if the
   * user profile has already been initialized.
   */
  getUserProfile(): UserProfile {
    return this.userProfile;
  }

  /**
   * Get the interface.service user profile listener
   * Will be called by the interface.component and CHILD elements of the interface.component if the
   * user profile has not yet been initialized.
   */
  getUserProfileListener(): Observable<UserProfile> {
    return this.userProfileSubj.asObservable();
  }

  /**
   * Get the abbreviated user profile
   * Will be called by the interface.component and CHILD elements of the interface.component if the
   * abbreviated user profile has already been initialized.
   */
  getAbbreviatedUserProfile(): AbbreviatedUserProfile {
    return this.userProfileAbr;
  }

  /**
   * Get the interface.service abbreviated user profile listener
   * Will be called by the interface.component and CHILD elements of the interface.component if the
   * abbreviated user profile has not yet been initialized.
   */
  getAbbreviatedUserProfileListener(): Observable<AbbreviatedUserProfile> {
    return this.userProfileAbrSubj.asObservable();
  }

  /**
   * Get the logged-in user's posting privileges
   * Will be called by the interface.component and CHILD elements of the interface.component if the
   * logged-in user's posting privileges has already been initialized.
   */
  getCanPost(): boolean {
    return this.canPost;
  }

  /**
   * Get the interface.service logged-in user's posting privileges listener
   * Will be called by the interface.component and CHILD elements of the interface.component if the
   * logged-in user's posting privileges has not yet been initialized.
   */
  getCanPostListener(): Observable<boolean> {
    return this.canPostSubj.asObservable();
  }

  /**
   * Get the list of all channels
   * Will be called by the interface.component and CHILD elements of the interface.component if the
   * abbreviated the list of all channels has already been initialized.
   */
  getAllChannels(): ChannelData[] {
    return this.allChannels;
  }

  /**
   * Get the interface.service list of all channels listener
   * Will be called by the interface.component and CHILD elements of the interface.component if the
   * list of all channels has not yet been initialized.
   */
  getAllChannelsListener(): Observable<ChannelData[]> {
    return this.allChannelsSubj.asObservable();
  }

  /**
   * Get the list of my channels
   * Will be called by the interface.component and CHILD elements of the interface.component if the
   * abbreviated the list of my channels has already been initialized.
   */
  getMyChannels(): ChannelData[] {
    return this.myChannels;
  }

  /**
   * Get the interface.service list of my channels listener
   * Will be called by the interface.component and CHILD elements of the interface.component if the
   * list of my channels has not yet been initialized.
   */
  getMyChannelsListener(): Observable<ChannelData[]> {
    return this.myChannelsSubj.asObservable();
  }

  /**
   * Get the interface.service listener that tracks when a new channel is being viewed
   */
  getNewChannelViewListener(): Observable<string> {
    return this.newChannelViewSubj.asObservable();
  }

  /**
   * Get a listener to track whether the user is currently muted or not
   */
  getIsMutedListener(): Observable<boolean> {
    return this.isMutedSubj.asObservable();
  }

  /************************************************************************************************
   * Setter functions
   ***********************************************************************************************/

  /**
   * Set the new channel that is being viewed in the interface
   *
   * @param channelID - the ID of the channel [floor/hallwide/RA]-[floor name]-[channel name]
   */
  setNewChannelView(channelID: string) {
    this.newChannelViewSubj.next(channelID);
    if (this.myChannelsMap.has(channelID)) {
      this.isMutedSubj.next(this.myChannelsMap.get(channelID).isMuted);
    }
  }

}
