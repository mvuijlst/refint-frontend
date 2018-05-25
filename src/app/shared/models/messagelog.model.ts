import { IMessageLog } from './messagelog.interface';
import { Person } from './person.model';
import { Message} from './message.model';
import { MessageLogDetail } from './messagelogdetail.model';

class MessageLogBase implements IMessageLog {
    constructor(
        public id: number,
        public messageType: string,
        public twilio_message_sid: string,
    ) {}
}

export class MessageLog extends MessageLogBase {
    public message: Message;
    public person: Person;
    public details: MessageLogDetail[] = [];
    constructor(mlog: any) {

        super(mlog['id'], mlog['messageType'], mlog['twilio_message_sid']);
        this.message = mlog['message'] ? new Message(mlog['message']) : null;
        // if (typeof mlog['person'] === 'number')
        this.person = mlog['person'] ? (typeof mlog['person'] === 'number') ?  new Person({id : mlog['person']}) : 
            new Person(mlog['person']) : null;
        if (mlog['details']) {
            for (const detail of mlog['details']) {
                this.details.push(new MessageLogDetail(detail));
            }
        }
    }
}
export class MessageLogComplete extends MessageLogBase {
    public message: Message;
    public details: MessageLogDetail[] = [];
    constructor(mlog: any) {
        super(mlog['id'], mlog['messageType'], mlog['twilio_message_sid']);
        // console.log(mlog);
        if (mlog['details']) {
            for (const log of mlog['details']) {
                this.details.push(new MessageLogDetail(log));
            }
        }
        if (mlog['message']) {
             this.message = new Message(mlog['message']);
        }
    }
}
// export class ContactMessageLog extends MessageLogBase {
//     public message: Message;
//     public person: Person;
//     constructor(msgLog: any) {
//         super(msgLog.id, msgLog.messageType, msgLog.twilio_message_sid);
//         // console.log(msgLog['person']);
//         this.message = new Message(msgLog['message']);
//         this.person = new Person(msgLog['person']);
//     }
// }




export enum MessageType {
    MAIL = 'mail',
    SMS = 'sms'
}
