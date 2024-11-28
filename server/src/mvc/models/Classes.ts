export default class Class {
    id?: number;
    user_id: number;
    teacher_id: number;

    constructor(user_id: number, teacher_id: number) {
        this.user_id = user_id;
        this.teacher_id = teacher_id;
    }
}
