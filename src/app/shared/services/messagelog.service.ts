import { Observable } from 'rxjs/Observable';
import { MessageLog } from './../models/messagelog.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable()
export class MessageLogService {
    constructor(private httpClient: HttpClient) {}

    messageLogUrl = '/interim/API/messagelogs/';


    saveMessageLogs(messagelogs: MessageLog[]): Observable<any> {
        console.log('post');
        return this.httpClient.post(this.messageLogUrl, messagelogs);

    }
}
