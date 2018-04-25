export class MessageLog{
    constructor(
        public id: number,
        public message: number,
        public messageType: string,
        public person: number
    ) {}
}

export enum MessageType {
    MAIL = 'mail',
    SMS = 'sms'
}
