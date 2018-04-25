import { Message } from './../models/message.model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class MessageService{
    constructor (private httpClient: HttpClient){}
    private messageUrl = '/interim/API/message/';
    private sendmessageUrl = '/interim/API/sendmessage/';


    saveMessage(message: Message): Observable<any> {
        console.log('post');
        return this.httpClient.post(this.messageUrl, message);

    }
    sendMessage(message:Message): Observable<any> {
        console.log('sendmessage');
        return this.httpClient.post(this.sendmessageUrl, message.id);
    }
}
