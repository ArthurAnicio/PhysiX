export default class Class {
    id?: number;
    user_id: number;
    teacher_id: number;
    week_day: string;
    from: string;
    to: string;

    constructor(user_id: number, teacher_id: number, week_day: string, from: string, to: string) {
        this.user_id = user_id;
        this.teacher_id = teacher_id;
        this.week_day = week_day;
        this.from = from;
        this.to = to;
    }
}
