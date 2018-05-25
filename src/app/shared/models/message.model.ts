import { Event } from './event.model';
import { Job } from './job.model';
import { MessageLog } from './messagelog.model';
import { User } from './user.model';

export class Message {
    public id: number;
    public subject: string;
    public message_mail: string;
    public infolink_mail: boolean;
    public confirmlink_mail: boolean;
    public deniallink_mail: boolean;
    public message_sms: string;
    public infolink_sms: boolean;
    public confirmlink_sms: boolean;
    public deniallink_sms: boolean;
    public created: Date;
    public created_by: User;
    public modified: Date;
    public modified_by: User;
    public messagelogs: MessageLog[] = [];
    public event?: Event;
    public job?: Job;

    constructor(msg: any) {
        // console.log('new message');
        this.id = msg['id'] ? msg['id'] : null;
        this.subject = msg['subject'] ? msg['subject'] : undefined;
        this.message_mail = msg['message_mail'] ? msg['message_mail'] : undefined;
        this.infolink_mail = msg['infolink_mail'] ? msg['infolink_mail'] : undefined;
        this.confirmlink_mail = msg['confirmlink_mail'] ? msg['confirmlink_mail'] : undefined;
        this.deniallink_mail = msg['deniallink_mail'] ? msg['deniallink_mail'] : undefined;
        this.message_sms = msg['message_sms'] ? msg['message_sms'] : undefined;
        this.infolink_sms = msg['infolink_sms'] ? msg['infolink_sms'] : undefined;
        this.confirmlink_sms = msg['confirmlink_sms'] ? msg['confirmlink_sms'] : undefined;
        this.deniallink_sms = msg['deniallink_sms'] ? msg['deniallink_sms'] : undefined;
        this.created = msg['created'] ? new Date(msg['created']) : undefined;
        this.created_by =  msg['created_by'] ? 
            typeof msg['created_by'] === 'number' ? 
                new User({id : msg['created_by']}) : new User(msg['created_by']) :
                undefined;
        this.modified =  msg['modified'] ? new Date(msg['modified']) : undefined;
        this.modified_by =  msg['modified_by'] ? msg['modified_by'] : undefined;
        if (msg['messageLogs']) {
            for (const log of msg['messageLogs']) {
                this.messagelogs.push(log);
            }
        }
        this.job = msg['job'] ? new Job(msg['job']) : undefined;
        this.event = msg['event'] ? new Event(msg['event']) : undefined;
    }
}

// export class ContactMessage extends Message {
//     public event: Event;
//     public job: Job;
//     constructor(msg: any) {
//         super(
//             msg.id,
//             msg.subject,
//             msg.message_mail,
//             msg.infolink_mail,
//             msg.confirmlink_mail,
//             msg.deniallink_mail,
//             msg.message_sms,
//             msg.infolink_sms,
//             msg.confirmlink_sms,
//             msg.deniallink_sms,
//             msg.created,
//             msg.created_by,
//             msg.modified,
//             msg.modified_by,
//             []);
//         if (msg['event']) { this.event = new Event(msg['event']); }
//         if (msg['job']) { this.job = new Job(msg['job']); }
//     }
// }
