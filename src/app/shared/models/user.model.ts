export class User {
    public id: number;
    public email: string;
    public username: string;
    public firstname: string;
    public lastname: string;
    
constructor(user: any) {
    this.id = user['id'],
    this.email = user['email'],
    this.username = user['username'],
    this.firstname = user['firstname'],
    this.lastname = user['lastname']
}
}
