import { Event } from './../models/event.model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '../models/location.model';

@Injectable()
export class EventService {
    constructor(private httpClient: HttpClient) {}
    private eventUrl = '/interim/API/events';

    getEvents(): Observable<Event[]>{
        return this.httpClient.get<Event[]>(this.eventUrl)
            .map(
                (events) => {
                    const eventsTmp:Event[]= [];
                    for (const event of events){
                        const eventTmp =
                            new Event(
                                event['id'],
                                event['name'],
                                event['description'],
                                event['datefrom'],
                                event['dateuntil'],
                                event['location'] ?
                                    new Location(
                                        event['location']['id'],
                                        event['location']['name'],
                                        event['description'])
                                        :
                                    new Location(0, '', ''),
                                event['persons']);
                        eventsTmp.push(eventTmp);
                    }
                    return eventsTmp;
                }
            );
    }
}
