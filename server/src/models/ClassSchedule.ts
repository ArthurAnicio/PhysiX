export default class ClassSchedule {
    id?: number;
    week_day: number;
    from: number;
    to: number;
    class_id: number;

    constructor(week_day: number, from: number, to: number, class_id: number) {
        this.week_day = week_day;
        this.from = from;
        this.to = to;
        this.class_id = class_id;
    }
}
