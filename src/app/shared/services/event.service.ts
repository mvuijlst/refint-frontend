import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { environment } from './../../../environments/environment';
import { map } from 'rxjs/operators';
import { Event } from './../models/event.model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '../models/location.model';

@Injectable()
export class EventService {

    private _events: Event[] = [];
    private eventUrl = environment.apiUrl + '/interim/API/events/';
    private eventSubScription: Subscription = Subscription.EMPTY;

    public events: BehaviorSubject<Event[]> = new BehaviorSubject(this._events);
    public eventsLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private httpClient: HttpClient) {
        this.eventSubScription = this.getEvents().subscribe(events => {
            this.events.next(events);
            this.eventsLoaded.next(true);
        })
    }

    getEvents(): Observable<Event[]> {
        return this.httpClient.get<Event[]>(this.eventUrl).pipe(
            map(
                (events) => {
                    for (const event of events) {
                        this._events.push( new Event(event));
                    }
                    return this._events;
                }
            ));
    }

    getEvent(eventId: number): Event {
        return this._events.find(event => event.id === eventId);
    }
}
