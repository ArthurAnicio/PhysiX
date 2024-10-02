export default class Post {
    id?: number;
    teacher_id: number;
    text: string;
    likes: number;
    replies: number;
    upload?: string | null;

    constructor(
        teacher_id: number,
        text: string,
        likes: number,
        replies: number,
        id?: number,
        upload?: string | null 
    ) {
        this.id = id;
        this.teacher_id = teacher_id;
        this.text = text;
        this.likes = likes;
        this.replies = replies;
        this.upload = upload; 
    }
}
