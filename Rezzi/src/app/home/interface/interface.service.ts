import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { RezziService } from 'src/app/rezzi.service';
import { NodeSession } from 'src/app/classes.model';

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

  constructor(private rezzi: RezziService) {
    console.log('interface.service constructor run');
    this.initializeNodeSession();
  }

  /************************************************************************************************
   * Initializer functions
   ***********************************************************************************************/

  private initializeNodeSession() {
    this.rezzi.getSession().then(response => {
      const session = response as NodeSession;
      this.nodeSessionSubj.next(session);
      this.nodeSession = session;
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
}
