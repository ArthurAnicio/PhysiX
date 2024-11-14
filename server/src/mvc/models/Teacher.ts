export default class Teacher {
    id?: number;
    name: string;
    email: string;
    password: string;
    number: string;
    avatar: string;
    schedule?: string;
    likedPosts?: string;
    likedReplies?: string;

    constructor(name: string, email: string, password: string, number: string, avatar: string = "uploads\\teacheravatars\\default.png", schedule?: string, likedPosts?: string, likedReplies?: string) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.number = number;
        this.avatar = avatar;
        this.schedule = schedule;
        this.likedPosts = likedPosts;
        this.likedReplies = likedReplies;
    }
}
