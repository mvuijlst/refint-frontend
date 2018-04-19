export class User {
    constructor(
        private user_id: number,
        private email: string,
        private username: string,
        private password: string,
        private exp: string,
    ) {}
}
