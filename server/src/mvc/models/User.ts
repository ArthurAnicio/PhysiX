export default class User {
    id?: number;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    verified: boolean;

    constructor(name: string, email: string, password: string, avatar: string = "uploads\\useravatars\\default.png", verified: boolean = false) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.avatar = avatar;
        this.verified = false
    }
}

