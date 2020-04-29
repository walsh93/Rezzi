import { Component, OnInit, Input } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import { ChannelNavBarService } from '../channel-nav-bar.service';
import { EventModalComponent } from './event-modal/event-modal.component';
import { MessagesService } from '../../messages/messages.service';
import { RezziService } from 'src/app/rezzi.service';
import { EventData, User } from 'src/app/classes.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  parseISO
} from 'date-fns';

const colors = [
  { // red
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  { // blue
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  { // yellow
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  { // turqoise
    primary: '#21adad',
    secondary: '#C9EBEB'
  },
  { // green
    primary: '#21ad21',
    secondary: '#D2EED2'
  },
  { // purple
    primary: '#8b64bb',
    secondary: '#DCD0EA'
  },
  { // orange
    primary: '#e59400',
    secondary: '#F5D9A5'
  },
  {  // pink
    primary: '#f74887',
    secondary: '#FCC7DB'
  }
];

interface CalendarEventExt extends CalendarEvent {
  data: EventData;
}

@Component({
  selector: 'app-calendar-panel',
  templateUrl: './calendar-panel.component.html',
  styleUrls: ['./calendar-panel.component.css']
})
export class CalendarPanelComponent implements OnInit {
  private channel_colors = {};
  private attending: EventData[] = [];
  private available: EventData[] = [];

  @Input() user: User;

  // Asynchronous data from parent component
  isHidden = true;  // By default, want to show channel messages and new-message component
  private isHiddenSubsc: Subscription;
  @Input() isHiddenObs: Observable<boolean>;

  // Current channel retrieved from interface.component
  private currentChannelID: string;
  private viewingUpdateSub: Subscription;
  @Input() viewingObs: Observable<string>;

  // angular-calendar stuff
  view: CalendarView = CalendarView.Week;  // The view type (Month, Day, Week)
  CalendarView = CalendarView;

  viewDate: Date = new Date();             // The current date being viewed
  activeDayIsOpen: boolean = true;         // Determines whether or not the currently viewed day has the panel open

  events: CalendarEventExt[] = [];              // The events in the calendar
  refresh: Subject<any> = new Subject();

  constructor(public dialog: MatDialog,
    private navbarService: ChannelNavBarService,
    public messagesService: MessagesService,
    public rezziService: RezziService) { }

  ngOnInit() {
    this.rezziService.getSession().then((response) => {
      this.user = response.email;
    });

    // Listen for whether or not to view this in the interface or some other component
    this.isHiddenSubsc = this.isHiddenObs.subscribe((viewNow) => {
      if (this.isHidden === viewNow) {
        this.isHidden = !viewNow;
        if (viewNow) {
          this.updateEvents();  // Update if you are viewing now, but you weren't before
        }
      }
    });

    // Listen for changes in which channel is being viewed TODO @Kai get messages in here!
    this.viewingUpdateSub = this.viewingObs.subscribe((updatedChannelID) => {
      if (updatedChannelID !== this.currentChannelID) {
        this.currentChannelID = updatedChannelID;
        if (!this.isHidden) {
          this.updateEvents();  // Update if you are viewing the members, but the channel changed
        }
      }
    });
  }

  updateEvents(): void {
    console.log("updating events...")
    this.navbarService.getEventsForChannel().subscribe(data => {
      this.events = [];
      console.log(data);
      data.channels.forEach((channel, i) => {
        this.channel_colors[channel] = colors[i];
      });
      this.attending = data.attending;
      this.available = data.available;

      this.attending.forEach(ev => {
        let to_push: CalendarEventExt = {
          start: parseISO(ev.start_time),
          end: parseISO(ev.end_time),
          title: ev.name + ' (attending)',
          color: this.channel_colors[ev.id.substring(0, ev.id.lastIndexOf('-'))],
          data: ev
        }

        this.events.push(to_push);
      });

      this.available.forEach(ev => {
        let to_push: CalendarEventExt = {
          start: parseISO(ev.start_time),
          end: parseISO(ev.end_time),
          title: ev.name,
          color: {primary: this.channel_colors[ev.id.substring(0, ev.id.lastIndexOf('-'))].primary, secondary: '#FFFFFF'},
          data: ev
        }

        this.events.push(to_push);
      });

      this.refresh.next();
    });
  }

  // Function for handling a date click
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  // Handles a clicking event on an Event (cancelation or click)
  handleEvent(action: string, event: CalendarEventExt): void {
    if (action === 'Canceled') {
      
    }
    else if (action === 'Clicked') {
      const dialogRef = this.dialog.open(EventModalComponent, {
        width: '800px',
        height: 'auto',
        data: {
          event: event.data,
          user: this.user
        },
      });

      dialogRef.componentInstance.EventResponseEvent.subscribe(response => {
        this.updateEvents();
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'canceled') {
          this.updateEvents();
        }
      })
    }
  }

  // sets the CalendarView (Month, Week Day)
  setView(view: CalendarView) {
    this.view = view;
  }

  // Closes the day panel (triggers when the view is changed)
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
