export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    likedPosts?: string;
    likedReplies?: string;
}