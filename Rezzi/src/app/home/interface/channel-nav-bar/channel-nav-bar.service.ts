import { Injectable, Output, EventEmitter } from '@angular/core'

@Injectable()
export class ChannelNavBarService {
  constructor() {}

  navTitle = 'Rezzi';

  @Output() setTitle: EventEmitter<string> = new EventEmitter();

  setNavTitle(title: string) {
    this.navTitle = title;
    this.setTitle.emit(this.navTitle);
  }

}
