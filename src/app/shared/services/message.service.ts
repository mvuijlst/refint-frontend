import { ErrorService } from './error.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from './../../../environments/environment';
import { map, catchError, tap } from 'rxjs/operators';
import { MessageLog, MessageLogComplete, MessageType } from './../models/messagelog.model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message.model';


@Injectable()
export class MessageService{
    constructor (private httpClient: HttpClient,
        private errorService: ErrorService){}

    public savedMessage: BehaviorSubject<Message> = new BehaviorSubject(new Message({}));
    private messageUrl = environment.apiUrl + '/interim/API/message/';
    private sendmessageUrl = environment.apiUrl + '/interim/API/sendmessage/';
    private messageLogUrl = environment.apiUrl + '/interim/API/personmsglogs/';
    private messagesUrl = environment.apiUrl + '/interim/API/messagesview/';

    saveMessage(message: Message): Observable<any> {
        const msg = {...<any>message};
        msg.messagelogs.forEach(log => {
            const personId = log.person.id;
            log.person = personId;
        });
        msg['event'] = message.event ? message.event.id : null;
        msg['job'] = message.job ? message.job.id : null;
        msg['created_by'] = message.created_by.id;
        msg['modified_by'] = message.created_by.id;
        return this.httpClient.post(this.messageUrl, msg).pipe(
            // map((msg)=> new Message(msg)),
            tap((msg)=>{
                let newmsg = new Message(msg);
                msg.messagelogs.forEach(log => {
                    let newlog = new MessageLog(log);
                    newlog.person.id = log.person;
                    newmsg.messagelogs.push(newlog);
                });
                this.savedMessage.next(newmsg)})
        );

    }

    sendMessage(message: Message): Observable<any> {
        return this.httpClient.post(this.sendmessageUrl, message.id).pipe(
            catchError(this.errorService.handleError('sendmessage', [])));
    }


    getPersonMessages(personId: number): Observable<Message[]> {
        return this.httpClient.get<MessageLog[]>(this.messageLogUrl + '?id=' + personId)
        .pipe(
            map(
                (logs) => {
                    const msgs: Message[] = [];
                    for (const log of logs) {
                        let msg = msgs.find(m => m.id === log.message.id);
                        const tmpLog = log;
                        if (msg !== undefined) {
                        } else {
                            // msg = new Message(log.message);
                            msgs.push(new Message(log.message));
                            msg = msgs.find(m => m.id === log.message.id);
                        }
                        log.message = undefined;
                        msg.messagelogs.push(new MessageLog(log));
                        // if (msgLogs.findIndex())
                    }
                    return msgs;

                }
            )
        );    
    }

    getJobMessages(jobId: number) : Observable<Message[]>{
        return this.httpClient.get<Message[]>(this.messagesUrl + '?jobid=' + jobId).pipe(
            // tap(msgs=> console.log(msgs)),
            map(
                (msgs) => {
                    const messages: Message[] = [];
                    msgs.forEach(msg => {
                        const newMsg = new Message(msg)
                        newMsg.messagelogs = [];
                        msg.messagelogs.forEach(log => {
                            newMsg.messagelogs.push(new MessageLog(log));
                        })
                        messages.push(newMsg);
                    });
                    return messages;
                }
            )
        )        
    }

    getMessages(): Observable<Message[]>{
        return this.httpClient.get<Message[]>(this.messagesUrl).pipe(
            // tap(msgs=> console.log(msgs)),
            map(
                (msgs) => {
                    const messages: Message[] = [];
                    msgs.forEach(msg => {
                        const newMsg = new Message(msg)
                        newMsg.messagelogs = [];
                        msg.messagelogs.forEach(log => {
                            newMsg.messagelogs.push(new MessageLog(log));
                        })
                        messages.push(newMsg);
                    });
                    return messages;
                }
            )
        )
    }
}
