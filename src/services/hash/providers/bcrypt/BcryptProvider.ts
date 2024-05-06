import bcrypt from 'bcrypt';
import { hashingConfig } from '@/config/hashing';
import { IHashProvider } from '@/services/hash/providers/IHashProvider';

/**
 * Provides hash functions using the bcrypt
 */
export class BcryptProvider implements IHashProvider {
	private bcrypt = bcrypt;
	private defaultRounds = hashingConfig.disks.bcrypt.defaultRounds;

	public async make(data: string, saltOrRounds: string | number = this.defaultRounds) {
		return await this.bcrypt.hash(data, saltOrRounds);
	}

	public async compare(data: string, encrypted: string) {
		return await this.bcrypt.compare(data, encrypted);
	}
}