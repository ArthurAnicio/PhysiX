export default class Invite {
    id?: number;
    user_id: number;
    teacher_id: number;
    accepted: boolean;

    constructor(user_id: number, teacher_id: number, accepted: boolean = false) {
        this.user_id = user_id;
        this.teacher_id = teacher_id;
        this.accepted = accepted;
    }
}
