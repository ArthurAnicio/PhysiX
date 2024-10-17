export default class LikedReply {
    id?: number;
    teacher_id?: number;
    user_id?: number;
    reply_id?: number;
    

    constructor(
        reply_id: number,
        id?: number,
        teacher_id?: number,
        user_id?: number
    ){
        this.id = id;
        this.teacher_id = teacher_id;
        this.user_id = user_id;
        this.reply_id = reply_id;
    }
}
