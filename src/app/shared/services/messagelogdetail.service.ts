import { environment } from './../../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageLogDetail } from '../models/messagelogdetail.model';

@Injectable()
export class MessageLogDetailService {
    constructor (private httpClient: HttpClient) {}
    feedbackUrl = environment.apiUrl + '/interim/API/messages/receiveMessageFeedback/';
    MessageLogDetailUrl = environment.apiUrl + '/interim/API/messagelogdetail/';

    save(mlogDetail: MessageLogDetail, signedId?: string): Observable<any> {
        const data = {'signedId' : signedId['id'], ...mlogDetail};

        return this.httpClient.post(this.feedbackUrl, data).pipe(
            tap(e => console.log(e)));
    }
    saveLog(mlogDetail: MessageLogDetail, logId: number) {
        const newLog:any =  mlogDetail
        newLog['messageLogDetailType'] = mlogDetail.messageLogDetailType.id;
        const data = {'messageLog' : logId, ...newLog};

        return this.httpClient.post(this.MessageLogDetailUrl, data).pipe(
            tap(e => console.log(e)));
    }
}
