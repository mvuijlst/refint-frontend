import { MessageLog } from "./messagelog.model";

export class Message {
    constructor(
        public id: number,
        public subject: string,
        public message_mail: string,
        public infolink_mail: boolean,
        public confirmlink_mail: boolean,
        public deniallink_mail: boolean,
        public message_sms: string,
        public infolink_sms: boolean,
        public confirmlink_sms: boolean,
        public deniallink_sms: boolean,
        public event: number,
        public job: number,
        public created: Date,
        public created_by: number,
        public modified: Date,
        public modified_by: number,
        public messagelogs: MessageLog[]
    ) {}
}
