import { ContactMethod } from './contactmethods.model';

export class Contact {
    constructor(
        public id: number,
        public contactMethod: ContactMethod,
        public contactData: string,
        public valid: boolean,
        public remark: string,
        public modified: Date
    ) {}
}
