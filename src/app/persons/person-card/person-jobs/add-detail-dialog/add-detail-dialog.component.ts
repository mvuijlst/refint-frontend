import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from './../../../../shared/services/auth.service';
import { MessageLogDetail, MessageLogDetailType } from './../../../../shared/models/messagelogdetail.model';
import { MessageLogDetailService } from './../../../../shared/services/messagelogdetail.service';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';
import { MessageLogDetailTypeService } from '../../../../shared/services/messagelogdetailtype.service';

@Component({
  selector: 'app-add-detail-dialog',
  templateUrl: './add-detail-dialog.component.html',
  styleUrls: ['./add-detail-dialog.component.scss']
})
export class AddDetailDialogComponent implements OnInit, OnDestroy {

  detailTypsSubscription: Subscription = Subscription.EMPTY;
  messageLogDetailSubscription: Subscription = Subscription.EMPTY;
  detailType: MessageLogDetailType[] = [];
  detailForm: FormGroup;
  resp:any;

  constructor(
    public dialogRef: MatDialogRef<AddDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private messageLogDetailService: MessageLogDetailService,
    private messageLogDetailTypeService: MessageLogDetailTypeService,
    private authService: AuthService
  ) { }


  saveComment() {
    const shortname = this.detailForm.value['fail'] === true ? 'admin_comm_fail' : 'admin_comm';
    const logdetail = new MessageLogDetail({
      id : 0,
      comment : this.detailForm.value['comment'],
      created : undefined,
      modified : undefined,
      modified_by : this.authService.getUserId(),
      created_by : this.authService.getUserId(),
      messageLogDetailType : this.detailType.find(t => t.shortname === shortname)
    })
    const logid = this.data;
    this.messageLogDetailSubscription = this.messageLogDetailService.saveLog(logdetail, logid).subscribe(
      (resp) => {
        resp['messageLogDetailType'] = this.detailType.find(t => t.shortname === shortname)
        this.resp = {response : resp, message: this.data};
        this.closeDialog();
      });

  }
  closeDialog(){
    this.dialogRef.close(this.resp);
  }

  ngOnInit() {
    this.detailTypsSubscription = this.messageLogDetailTypeService.getDetailTypes().subscribe(types => this.detailType = types);
    this.detailForm = new FormGroup({
      'comment': new FormControl(null),
      'fail' : new FormControl(false)
      });
  }
  
  ngOnDestroy() {
    this.detailTypsSubscription.unsubscribe();
    this.messageLogDetailSubscription.unsubscribe();
  }
}
