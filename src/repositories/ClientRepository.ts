import { User } from '@/entities/User';
import { AppDataSource } from '@/data-source';

export const ClientRepository = AppDataSource.getRepository(User).extend({
	async findByEmail(email: string): Promise<User | null> {
		return this.findOne({ where: { email } });
	},
})