import { environment } from './../../../environments/environment';
import { Job } from './../models/job.model';
import { Event } from './../models/event.model';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { MessageLog,  MessageLogComplete } from './../models/messagelog.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message.model';
import { Location } from '../models/location.model';
import { Person } from '../models/person.model';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
@Injectable()
export class MessageLogService {
    constructor(private httpClient: HttpClient) {}

    contactMessageLogUrl = environment.apiUrl + '/interim/API/messages/contactmessage/';
    messageLogUrl = environment.apiUrl + '/interim/API/personmsglogs/';
    getMessage(signedId: any): Observable<MessageLogComplete | ErrorObservable> {
        return this.httpClient.post<MessageLogComplete>(this.contactMessageLogUrl, signedId)
            .pipe(
                map(
                    (msgLog) => {
                        if (msgLog['error']) {
                            return new ErrorObservable(msgLog['error']); }
                        const mLog = new MessageLogComplete(msgLog);
                        return mLog;
                    })
            );
    }
    getPersonMessageLogs(personId: number): Observable<MessageLogComplete[]> {
        return this.httpClient.get<MessageLog[]>(this.messageLogUrl + '?id=' + personId)
            .pipe(
                map(
                    (logs) => {
                        const msgLogs: MessageLogComplete[] = [];
                        for (const log of logs) {
                            msgLogs.push(new MessageLogComplete(log));
                        }
                        return msgLogs;
                    }
                )
            );
    }
}
