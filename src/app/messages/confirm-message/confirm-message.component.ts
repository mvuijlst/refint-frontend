import { Subscription } from 'rxjs/Subscription';
import { MessageLogDetailService } from './../../shared/services/messagelogdetail.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MessageLogDetail } from './../../shared/models/messagelogdetail.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-message',
  templateUrl: './confirm-message.component.html',
  styleUrls: ['./confirm-message.component.scss']
})
export class ConfirmMessageComponent implements OnInit {

  @Input() signedid:string;
  @Input() msgLogDetail: MessageLogDetail;
  messageSaved = false
  msgLogSubscription: Subscription = Subscription.EMPTY;

  form: FormGroup;
  constructor(private messageLogDetailService: MessageLogDetailService) { }

  saveComment(){
    this.msgLogDetail.comment = this.form.value['boodschap'];

    this.msgLogSubscription = this.messageLogDetailService.save(this.msgLogDetail, this.signedid).subscribe(
      (e) => {
        console.log(e)
        this.messageSaved = true;
      }
    );
    console.log(this.msgLogDetail);
      console.log(this.form.value['boodschap']);
  }

  ngOnInit() {
    this.form = new FormGroup(
      {'boodschap' : new FormControl(null)}
    )
    console.log(this.msgLogDetail)

  }

}
