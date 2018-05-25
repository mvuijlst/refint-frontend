import { MessageLogDetailService } from './../shared/services/messagelogdetail.service';
import { MessageLogDetailTypeService } from './../shared/services/messagelogdetailtype.service';
import { Message } from './../shared/models/message.model';
import { MessageLogDetail, MessageLogDetailType } from './../shared/models/messagelogdetail.model';
import { DatePipe } from '@angular/common';
import { Event } from './../shared/models/event.model';
import { MessageLog,  MessageLogComplete } from './../shared/models/messagelog.model';
import { MessageLogService } from './../shared/services/messagelog.service';
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy{

  messageLogSubscription: Subscription = Subscription.EMPTY;
  messageLogDetailTypeSubscription: Subscription = Subscription.EMPTY;
  messageLogDetailSubscription: Subscription = Subscription.EMPTY;
  messageLogDetail: MessageLogDetail;
  messageLog: MessageLogComplete | any;
  messageLogDetailTypes: MessageLogDetailType[] = [];
  answered = false;
  savingmessage = false;
  savedLogDetail: MessageLogDetail;
  messageConfirm = false;
  constructor(
    private activateRoute: ActivatedRoute,
    private messageLogService: MessageLogService,
    private datePipe: DatePipe,
    private messageLogDetailTypeService: MessageLogDetailTypeService,
    private messageLogDetailService: MessageLogDetailService,
  ) { }
  signedLogId: any;


  // cardSubTitle(): string {
  //   let sub = '';
  //   if (this.messageLog) {
  //     sub += (this.messageLog.messageType === 'sms') ?
  //       'sms tel : ' + this.messageLog.person.defaultMobile :
  //       'e-mail : ' + this.messageLog.person.defaultMail;
  //     sub += ' [datum : ' + this.datePipe.transform(this.messageLog.message.created) + ']';
  //     // sub = this.messageLog.message.job ? 'Job : ' + this.messageLog.message.job.name :
  //   //   this.messageLog.message.event ? 'Event : ' + this.messageLog.message.event.name : '';
  //   }
  //   return sub;
  // }

  // checkConfirmLink(): boolean {
  //   if (this.messageLog) {
  //     return (this.messageLog.messageType === 'sms') ? this.messageLog.message.confirmlink_sms : this.messageLog.message.confirmlink_mail;
  //   }
  // }

  saveLogDetail(e, type: string): boolean {
    this.savingmessage = true;
    this.messageLogDetail = new MessageLogDetail(
      {
        'id': null,
        'messageLogDetailType' : this.messageLogDetailTypes.find(t => t.shortname === type),
        'created' : undefined,
        'created_by' : undefined,
        'modified' : undefined,
        'modified_by' : undefined,
        'comment' : '',
      }
    );

    this.messageLogDetailSubscription = this.messageLogDetailService.save(this.messageLogDetail, this.signedLogId)
      .subscribe(
        (e) => {
          this.messageConfirm = true;
          this.savingmessage = false;
          this.savedLogDetail = new MessageLogDetail(e);
          this.savedLogDetail.messageLogDetailType = this.messageLogDetailTypes.find(t => t.id === e.messageLogDetailType),
          console.log(e);

        }
      );
    return false;
  }

  ngOnInit() {
    this.signedLogId =  {'id' : this.activateRoute.snapshot.params['id']};
    this.messageLogSubscription = this.messageLogService.getMessage(this.signedLogId).subscribe(
      (msg) => {
        this.messageLog = msg;
        // this.answered = (<MessageLogComplete>this.messageLog).details.findIndex(det => det.messageLogDetailType.shortname === 'yes' || det.messageLogDetailType.shortname === 'no')>-1;
        console.log(this.messageLog);
      }
    );
    this.messageLogDetailTypeSubscription = this.messageLogDetailTypeService.detailTypes.subscribe(
      (types) => {
        this.messageLogDetailTypes = types;
        console.log(types);
      }
    );
  }
  ngOnDestroy(): void {
    this.messageLogSubscription.unsubscribe();
    this.messageLogDetailTypeSubscription.unsubscribe();
    this.messageLogDetailSubscription.unsubscribe()
  }

}
