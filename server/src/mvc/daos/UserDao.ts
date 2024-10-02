import db from '../database/connection';
import { User } from '../mvc/models/User';

export default class UserDAO {
    
    async findByUsernameOrEmail(username: string, password: string): Promise<User | null> {
        const user = await db('users')
            .where(function() {
                this.where('name', username)
                    .orWhere('email', username);
            })
            .andWhere('password', password)
            .first();
        return user || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await db('users').where({ email }).first();
        return user || null;
    }

    async findById(id: number): Promise<User | null> {
        const user = await db('users').where({ id }).first();
        return user || null;
    }

    async insert(user: User): Promise<void> {
        await db('users').insert(user);
    }

    async update(id: number, data: Partial<User>): Promise<void> {
        await db('users').where({ id }).update(data);
    }

    async getUserFavorites(teacher_id: number): Promise<User[]> {
        const users = await db('users').select('avatar', 'email', 'id', 'name').whereIn('id', function () {
            this.select('user_id').from('favorites').where('teacher_id', teacher_id);
        });
        return users;
    }

    async getUser(userId: number) {
        return await db('users').where('id', userId).first();
    }
}
