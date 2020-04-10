import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { RezziService } from 'src/app/rezzi.service';
import { NodeSession, AbbreviatedUser, User, UserProfile, AbbreviatedUserProfile } from 'src/app/classes.model';

/**
 * This is the service that can be used by the interface.component and it's child elements. The
 * interface.service employs functions from the Rezzi service.
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

  constructor(private rezzi: RezziService) {
    console.log('interface.service constructor run');
    this.initializeNodeSession();
    this.initializeUserProfiles();
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
      const profile = response as UserProfile;
      const profileAbr: AbbreviatedUserProfile = {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        nickName: profile.nickName
      };
      this.userProfile = profile;
      this.userProfileAbr = profileAbr;
      this.userProfileSubj.next(profile);
      this.userProfileAbrSubj.next(profileAbr);
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

}
