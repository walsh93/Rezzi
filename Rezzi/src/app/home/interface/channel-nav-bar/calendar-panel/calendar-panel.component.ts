import { Component, OnInit, Input } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ChannelNavBarService } from '../channel-nav-bar.service';
import { MessagesService } from '../../messages/messages.service';
import { RezziService } from 'src/app/rezzi.service';
import { EventData } from 'src/app/classes.model';
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
  private user: string;

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

  constructor(private navbarService: ChannelNavBarService,
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
    this.navbarService.getEventsForChannel().subscribe(data => {
      data.channels.forEach((channel, i) => {
        this.channel_colors[channel] = colors[i];
      });
      this.attending = data.attending;
      this.available = data.available;

      this.attending.forEach(ev => {
        let to_push: CalendarEventExt = {
          start: parseISO(ev.start_time),
          end: parseISO(ev.end_time),
          title: ev.name,
          color: this.channel_colors[ev.id.substring(0, ev.id.lastIndexOf('-'))],
          cssClass: '', // TODO: add custom css-class for attending events
          data: ev
        }

        if (ev.owner.email === this.user) {
          to_push.actions = [{
            label: '<i class="fa fa-fw fa-pencil"></i>',  // TODO change to material-icon for cancellation
            a11yLabel: 'Cancel',
            onClick: ({ event }: { event: CalendarEvent }): void => {
              this.handleEvent('Canceled', event);
            },
          }]
        }

        this.events.push(to_push);
      });

      this.available.forEach(ev => {
        let to_push: CalendarEventExt = {
          start: parseISO(ev.start_time),
          end: parseISO(ev.end_time),
          title: ev.name,
          color: this.channel_colors[ev.id.substring(0, ev.id.lastIndexOf('-'))],
          cssClass: '', // TODO: add custom css-class for unattended events
          data: ev
        }

        if (ev.owner.email === this.user) {
          to_push.actions = [{
            label: '<i class="fa fa-fw fa-pencil"></i>',  // TODO change to material-icon for cancellation
            a11yLabel: 'Cancel',
            onClick: ({ event }: { event: CalendarEvent }): void => {
              this.handleEvent('Canceled', event);
            },
          }]
        }

        this.events.push(to_push);
      });
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
  handleEvent(action: string, event: CalendarEvent): void {
    if (action === 'Canceled') {

    }
    else if (action === 'Clicked') {

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
