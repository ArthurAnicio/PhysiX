export default class User {
    id?: number;
    name: string;
    email: string;
    password: string;
    avatar?: string;

    constructor(name: string, email: string, password: string, avatar: string = "uploads\\useravatars\\default.png") {
        this.name = name;
        this.email = email;
        this.password = password;
        this.avatar = avatar;
    }
}

