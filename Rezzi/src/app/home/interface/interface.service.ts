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

  // Channel data
  private allChannels: ChannelData[] = [];
  private allChannelsSubj = new Subject<ChannelData[]>();
  private myChannels: ChannelData[] = [];
  private myChannelsSubj = new Subject<ChannelData[]>();

  constructor(private rezzi: RezziService, private sidePanel: SidePanelService) {
    console.log('interface.service constructor run');
    this.initializeNodeSession();
    this.initializeUserProfiles();
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

  private initializeUserProfiles() {
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
      this.userProfileSubj.next(profile);
      this.userProfileAbrSubj.next(profileAbr);
    });
  }

  private initializeChannels() {
    this.sidePanel.getChannels().toPromise().then(data => {
      for (const hall in data) {
        if (data.hasOwnProperty(hall)) {
          let tempBelongs = false;  // Set if the user doesn't belong to any chats within the category
          const tempChannels: ChannelData[] = [];
          // tslint:disable-next-line: forin
          for (const channel in data[hall]) {
            tempChannels.push({
              id: hall + '-' + channel,
              channel,
              users: data[hall][channel].users,
              belongs: data[hall][channel].belongs,
              isMuted: data[hall][channel].isMuted,
              subchannels: [],
              messages: data[hall][channel].messages
            });
            if (data[hall][channel].belongs) {
              tempBelongs = true;
            }

            // Filtered channels for sibling components
            if (data[hall][channel].belongs) {
              this.myChannels.push({
                id: hall + '-' + channel,
                channel,
                users: data[hall][channel].users,
                belongs: data[hall][channel].belongs,
                isMuted: data[hall][channel].isMuted,
                subchannels: [],
                messages: data[hall][channel].messages
              });
            }
          }
          let name = hall;
          if (hall.indexOf('floors') !== -1) {  // only use the back half of 'floors-...'
            name = hall.split('-')[1];
          }
          const temp: ChannelData = {
            id: '',
            channel: name,
            users: -1,
            belongs: tempBelongs,
            isMuted: false,
            subchannels: tempChannels,
            messages: []  // TODO does this temp thing have messages at any point???
          };
          this.allChannels.push(temp);
        }
      }
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

}
