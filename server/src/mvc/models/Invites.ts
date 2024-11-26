export default class Invite {
    id?: number;
    user_id: number;
    teacher_id: number;
    accepted: boolean;
    schedule: string;

    constructor(user_id: number, teacher_id: number, accepted: boolean = false, schedule: string) {
        this.user_id = user_id;
        this.teacher_id = teacher_id;
        this.accepted = accepted;
        this.schedule = schedule;
    }
}
