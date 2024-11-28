export default class Message {
    id?: number;
    user_id: number;
    teacher_id: number;
    invite_id: number;
    message: string;
    type:string;
    price:string;

    constructor(user_id: number, teacher_id: number, invite_id: number, message: string, type:string, price:string) {
        this.user_id = user_id;
        this.teacher_id = teacher_id;
        this.invite_id = invite_id
        this.message = message;
        this.type = type;
        this.price = price;
    }
}
