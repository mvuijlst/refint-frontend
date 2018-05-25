import { JobCardBasicComponent } from './../jobs/job-card-basic/job-card-basic.component';
import { AddPersonjobDialogComponent } from './../persons/person-card/person-jobs/add-personjob-dialog/add-personjob-dialog.component';
import { AddDetailDialogComponent } from './../persons/person-card/person-jobs/add-detail-dialog/add-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { filter } from 'rxjs/operators';
import { MessageLogDetailTypeService } from './../shared/services/messagelogdetailtype.service';
import { MessageLogDetailType } from './../shared/models/messagelogdetail.model';
import { PersonService } from './../shared/services/person.service';
import { Message } from './../shared/models/message.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../shared/services/message.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-succession',
  templateUrl: './succession.component.html',
  styleUrls: ['./succession.component.scss']
})
export class SuccessionComponent implements OnInit, OnDestroy {

  messages: Message[] = [];
  newMessages: Message[] = [];
  


  personCount = 0;
  smsCount = 0;
  mailCount = 0;
  msgsSubscription: Subscription = Subscription.EMPTY;
  constructor(
    private messageService: MessageService,
    private personService: PersonService,
    private messageLogDetailTypeService: MessageLogDetailTypeService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
  ) { }


showAddDetail(msg: any, person:any) {
  console.log(msg);
  console.log(person);
  const logid = person.msgLogs[person.msgLogs.length-1].logid;
  let dialogref = this.dialog.open(AddDetailDialogComponent, {
    data : logid,
  })
  dialogref.afterClosed().subscribe(res => {
    person.msgLogs.push({
      'logid' : res.response.messageLog,
      'messagetype' : person.msgLogs[person.msgLogs.length-1].messageType,
      'created' : new Date(res.response.created),
      'comment' : res.response.comment,
      'detailType' : res.response.messageLogDetailType,
      'tooltip' : '[' + this.datePipe.transform(new Date(res.response.created), 'dd/MM HH:mm:ss') + '] ' + 
      person.msgLogs[person.msgLogs.length-1].messageType + ' : ' + res.response.messageLogDetailType.name 
        })
  })
}

showAddPersonJob(msg, person){
  console.log(msg);
  let dialogref = this.dialog.open(AddPersonjobDialogComponent, {
    data : {msgid : msg.id, job: msg.job, personid : person.id, personname: person.firstName + ', ' + person.lastName}
  })
  dialogref.afterClosed().subscribe(
    res => {
      if (res){
        console.log(res);
        msg.job.personsId.push(person.id);
        this.groupPersonLog();
        }
    })
}

  groupPersonLog(){
    let newmsgs = this.messages.slice();
    newmsgs.forEach(msg => {
      msg['persons'] = []
      msg.messagelogs.forEach(log => {
        let pers = msg['persons'].find(p => p.id === log.person.id)
        if(!pers) {
          pers = this.personService.getPerson(log.person.id);
          pers['msgLogs'] = [];
          pers['jobConnected'] = msg.job ? msg.job.personsId.find(id => id === pers.id)>0 ? true : false : true;
          msg['persons'].push(pers);
        }
        log.details.forEach(detail => {
          const detailType = this.messageLogDetailTypeService.getDetailType(detail.messageLogDetailType.id)
          pers['msgLogs'].push({
            'logid' : log.id,
            'messagetype' : log.messageType,
            'created' : detail.created,
            'comment' : detail.comment,
            'detailType' : detailType,
            'tooltip' : '[' + this.datePipe.transform(detail.created, 'dd/MM HH:mm:ss') + '] ' + 
            log.messageType + ' : ' + detailType.name 
              })
        })
      });
      msg['personCount'] = msg['persons'].length;
      msg['mailCount'] = msg.message_mail ? msg['persons'].filter(p=>p.defaultMail !== '').length : 0;
      msg['smsCount'] = msg.message_sms ? msg['persons'].filter(p=>p.defaultMobile !== '').length : 0;
    });
    this.newMessages = newmsgs;
    console.log(newmsgs)
  }

  ngOnInit() {
    this.msgsSubscription = this.messageService.getMessages().subscribe(msgs => {
      this.messages = msgs;
      console.log(msgs);
      this.groupPersonLog();
    });

  }
  
  ngOnDestroy(){
    this.msgsSubscription.unsubscribe();
  }
}
