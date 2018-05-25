import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MessageLogDetailType } from './../models/messagelogdetail.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class MessageLogDetailTypeService {

    public detailTypes: BehaviorSubject<MessageLogDetailType[]> = new BehaviorSubject([]);

    private detailTypesUrl = environment.apiUrl + '/interim/API/messagelogdetailtypes/';
    private _detailtypes: MessageLogDetailType[] = [];
    private detailtypesSubscription: Subscription = Subscription.EMPTY;

    constructor (private httpClient: HttpClient) {
        this.detailtypesSubscription = this.getDetailTypes().subscribe(types => {
            this._detailtypes = types;
            this.detailTypes.next(this._detailtypes);
        })

    }


    getDetailTypes(): Observable<MessageLogDetailType[]> {
        return this.httpClient.get<MessageLogDetailType[]>(this.detailTypesUrl);
    }

    getDetailType(id): MessageLogDetailType {
        return this._detailtypes.find(t=> t.id === id);
    }
}
