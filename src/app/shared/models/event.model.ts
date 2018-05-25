import { Location } from './location.model';
export class Event {
    public id: number;
    public name: string;
    public description: string;
    public datefrom: Date;
    public dateuntil: Date;
    public location: Location;
    public persons: number[];
    constructor(event: any) {
        console.log(event);
        if (typeof event === 'number'){
            this.id = event
        } else {
            this.id = event['id'] ? event['id'] : undefined;
        }
        this.name = event['name'] ? event['name'] : undefined;
        this.description = event['description'] ? event['description'] : undefined;
        this.datefrom = event['datefrom'] ? new Date(event['datefrom']) : undefined;
        this.dateuntil = event['dateuntil'] ? new Date(event['dateuntil']) : undefined;
        this.location = event['location'] ? new Location(event['location']) : undefined;
    }
}
