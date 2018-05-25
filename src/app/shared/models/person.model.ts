import { environment } from './../../../environments/environment';
import { LanguageProficiency } from './languageproficiency.model';
import { Address } from './address.model';
import { Interviewer } from './interviewer.model';
import { Country } from './country.models';
import { JobType } from './jobtype.model';
import { FamilySituation } from './familysituation.model';
import { RefuType } from './refutype.model';
import { Contact } from './contact.model';
import { ContactMethod } from './contactmethods.model';
import { KeyValue } from './keyvalue.model';
import { KeyValueDescription } from './keyvaluedesc.model';
import { Remark } from './remark.model';

export class Person {
    public id: number;
    public number: number;
    public firstName: string;
    public lastName: string;
    public foto: string;
    public interviewer: KeyValue;
    public gender: string;
    public birthdate: Date;
    public rrn: string;
    public bankaccount: string;
    public homecountry: KeyValue;
    public homecity: string;
    public refutype: RefuType;
    public experience: string;
    public interests: string;
    public workBelgium: string;
    public activityIntake: string;
    public ambitions: string;
    public jobtype1: KeyValueDescription;
    public jobtype2: KeyValueDescription;
    public jobtype3: KeyValueDescription;
    public jobtypenot: KeyValueDescription;
    public jobpool1: KeyValueDescription;
    public jobpool2: KeyValueDescription;
    public jobpool3: KeyValueDescription;
    public arrival: Date;
    public beBankaccount: boolean;
    public beDriverslicense: boolean;
    public familySituation: KeyValue;
    public halal: boolean;
    public alcohol: boolean;
    public maxhours: boolean;
    public remarks: string;
    public nlclasses: boolean;
    public nlclasswhere: string;
    public nllevel: number;
    public nlremark: string;
    public timestamp: Date;
    public status: string;
    public outcome: string;
    public created: Date;
    public modified: Date;
    public contacts: Contact[] = [];
    public addresses: Address[] = [];
    public languages: LanguageProficiency[] = [];
    public defaultAddress: Address;
    public defaultMobile: string;
    public defaultMail: string;
    public personremarks: Remark[] = [];
    constructor(person: any) {
        this.firstName = (person['firstname']) ? person['firstname'] : '';
        this.birthdate = (person['birthdate']) ? person['birthdate'] : '';
        this.lastName = (person['lastname']) ? person['lastname'] : '';
        this.id = (person['id']) ? person['id'] : 0;
        this.number = (person['number']) ? person['number'] : '';
        this.foto = (person['foto']) ? person['foto'] : '';
        this.gender = (person['gender']) ? person['gender'] : '';
        this.rrn = (person['rrn']) ? person['rrn'] : '';
        this.bankaccount = (person['bankaccount']) ? person['bankaccount'] : '';
        this.interests = (person['interests']) ? person['interests'] : '';
        this.workBelgium = (person['workBelgium']) ? person['workBelgium'] : '';
        this.activityIntake = (person['activityIntake']) ? person['activityIntake'] : '';
        this.ambitions = (person['ambitions']) ? person['ambitions'] : '';
        this.arrival = (person['arrival']) ? person['arrival'] : '';
        this.beBankaccount = (person['beBankaccount']) ? person['beBankaccount'] : '';
        this.beDriverslicense = (person['beDriverslicense']) ? person['beDriverslicense'] : '';
        this.halal = (person['halal']) ? person['halal'] : '';
        this.alcohol = person['alcohol'];
        this.maxhours = person['maxhours'];
        this.nlclasses = person['nlclasses'];
        this.nlclasswhere = person['nlclasswhere'];
        this.nllevel = person['nllevel'];
        this.nlremark = person['nlremark'];
        this.timestamp = person['timestamp'];
        this.status = person['status'];
        this.outcome = person['outcome'];
        this.created = person['created'];
        this.modified = person['modified'];
        this.experience = person['experience'];
        this.remarks = person['remarks'];
        if (person['refutype']) {
            this.refutype = new RefuType(person['refutype']['id'], person['refutype']['name']);
        } else {
            this.refutype = new RefuType(0, 'ongekend');
        }
        if (person['familySituation']) {
            this.familySituation = new KeyValue(person['familySituation']['id'], person['familySituation']['name']);
        }
        if (person['homecountry']) {
            this.homecountry = new KeyValue(person['homecountry']['id'], person['homecountry']['name']);
        }
        if (person['personaddresses']){
            for (const add of person['personaddresses']) {
                this.addresses.push(new Address(add));
            }
            this.defaultAddress = this.getAddress();
        }
        if (person['contacts']) {
            for (const contact of person['contacts']) {
                this.contacts.push(
                    new Contact(
                        contact['id'],
                        // tslint:disable-next-line:max-line-length
                        new ContactMethod(
                            contact['contactmeans']['id'],
                            contact['contactmeans']['name'],
                            contact['contactmeans']['active']),
                        contact['contactdata'],
                        contact['valid'],
                        contact['remark'],
                        contact['modified']));
            }
            this.defaultMail = this.getContactMethod('E-mail');
            this.defaultMobile = this.getContactMethod('GSM');
        }
        if (person['personremarks']) {
            person['personremarks'].forEach(remark => {
                this.personremarks.push(new Remark(remark));
            });
        }
        if (person['interviewer']) {
            this.interviewer = new KeyValue(person['interviewer']['id'], person['interviewer']['name']);
        }
        if (person['jobtype1']) {
            this.jobtype1 = new JobType(person['jobtype1']);
        }
        if (person['jobtype2']) {
            this.jobtype2 = new JobType(person['jobtype2']);
        }
        if (person['jobtype3']) {
            this.jobtype3 = new JobType(person['jobtype3']);
        }
        if (person['jobtypenot']) {
            this.jobtypenot = new JobType(person['jobtypenot']);
        }
        if (person['jobpool1']) {
            this.jobpool1 = new JobType(person['jobpool1']);
        }
        if (person['jobpool2']) {
            this.jobpool2 = new JobType(person['jobpool2']);
        }
        if (person['jobpool3']) {
            this.jobpool3 = new JobType(person['jobpool3']);
        }
        if (person['languages']) {
            for (const lang of person['languages']) {
                this.languages.push(new LanguageProficiency(lang));
            }
        }
        // console.log(this.foto);

    }

    getContactMethod(name: string): string {
        if (this.contacts) {
            return this.contacts.find(contact => contact.contactMethod.name === name && contact.valid === true) ?
                this.contacts.find(contact => contact.contactMethod.name === name && contact.valid === true).contactData : '';
        } else {
            return '';
        }
    }
    getAddress(): Address {
        if (this.addresses.length > 0) {
            return this.addresses.find(add => add.valid === true );
        }
        return new Address(
            {
                'address' : 'ongekend',
                'postalcode' : '',
                'city' : '',
                'dateuntil' : '',
                'datefrom' : '',
                'valid' : false,
                'remarks' : ''
            }
        );
    }
}
