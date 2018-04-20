export class Message {
    constructor(
        public subject: string,
        public message_mail: string,
        public message_sms: string,
        public event: number,
        public job: number
    ) {}
}
