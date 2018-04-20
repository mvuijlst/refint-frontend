import { Location } from './location.model';
export class Event{
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public dateFrom: Date,
        public dateUntil: Date,
        public location: Location,
        public persons: number[]
    ) {}
}
