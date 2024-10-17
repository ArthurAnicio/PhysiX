export default class LikedPost {
    id?: number;
    teacher_id?: number;
    user_id?: number;
    post_id?: number;
    

    constructor(
        post_id: number,
        id?: number,
        teacher_id?: number,
        user_id?: number
    ){
        this.id = id;
        this.teacher_id = teacher_id;
        this.user_id = user_id;
        this.post_id = post_id;
    }
}
