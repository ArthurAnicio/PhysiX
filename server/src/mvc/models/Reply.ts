export default class Reply {
    id?: number;
    teacher_id?: number;  
    user_id?: number;     
    post_id: number;
    text: string;
    likes: number;

    constructor(
        post_id: number,
        text: string,
        likes: number = 0,
        id?: number,
        teacher_id?: number,  
        user_id?: number      
    ) {
        this.id = id;
        this.teacher_id = teacher_id;
        this.user_id = user_id;
        this.post_id = post_id;
        this.text = text;
        this.likes = likes;
    }
}
