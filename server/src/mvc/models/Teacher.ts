export default class Teacher {
    id?: number;
    name: string;
    email: string;
    password: string;
    number: string;
    avatar: string;
    schedule?: string;

    constructor(name: string, email: string, password: string, number: string, avatar: string = "uploads\\teacheravatars\\default.png", schedule?: string) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.number = number;
        this.avatar = avatar;
        this.schedule = schedule;
    }
}
