import { AddPersonjobDialogComponent } from './../../../persons/person-card/person-jobs/add-personjob-dialog/add-personjob-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MessageLogDetailTypeService } from './../../../shared/services/messagelogdetailtype.service';
import { PersonService } from './../../../shared/services/person.service';
import { Job } from './../../../shared/models/job.model';
import { JobService } from './../../../shared/services/job.service';
import { MessageService } from './../../../shared/services/message.service';
import { Message } from './../../../shared/models/message.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-job-messages',
  templateUrl: './job-messages.component.html',
  styleUrls: ['./job-messages.component.scss']
})
export class JobMessagesComponent implements OnInit, OnDestroy {

  job: Job;
  messages: any[] = []
  msgSubscription: Subscription = Subscription.EMPTY;
  jobSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private dialog: MatDialog,
    private msgService: MessageService,
    private personService: PersonService,
    private jobService: JobService,
    private messageLogDetailTypeService: MessageLogDetailTypeService,
    private datePipe: DatePipe
  ) { }


  loadMessages(){
    this.msgSubscription = this.msgService.getJobMessages(this.job.id).subscribe(msgs => {
      this.messages = msgs;
      this.groupPersonLog();
    });

  }

  showAddPersonJob(msg, person){
    let dialogref = this.dialog.open(AddPersonjobDialogComponent, {
      data : {msgid : msg.id, job: msg.job, personid : person.id, personname: person.firstName + ', ' + person.lastName}
    })
    dialogref.afterClosed().subscribe(
      res => {
        if (res){
          console.log(res);
          this.jobService.addPersonJob(res);
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
          pers = {};
          pers['id'] = log.person.id
          pers['name'] = this.personService.getPersonName(log.person.id);
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
    this.messages = newmsgs;
//    console.log(newmsgs)
  }



  ngOnInit() {
    this.jobSubscription = this.jobService.selectedJob.subscribe(job => {
      this.job = job;
      this.loadMessages();

    });
  }
  ngOnDestroy(){
    this.msgSubscription.unsubscribe();
    this.jobSubscription.unsubscribe();
  }

}
