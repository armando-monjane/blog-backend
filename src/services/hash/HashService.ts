import { hashingConfig } from '@/config/hashing';
import { Service } from 'typedi';
import { BcryptProvider, IHashProvider } from '@/services/hash/providers';

/**
 * Service for hashing and comparing data using different hashing algorithms.
 */
@Service()
export class HashService {
	private provider!: IHashProvider;

	public constructor() {
		this.setDriver(hashingConfig.defaultDriver);
	}

	/**
		 * Sets the driver for hashing.
		 * @param {string} driver - The driver to be set.
	*/
	public setDriver(provider: string) {
		switch (provider) {
		case 'bcrypt':
			this.provider = new BcryptProvider();
			break;

		default:
			this.provider = new BcryptProvider();
			break;
		}

		return this;
	}

	/**
	 * Hashes the given data using the specified salt or number of rounds.
	 * @param data The data to be hashed.
	 * @param saltOrRounds The salt or number of rounds to be used for hashing. Defaults to 10.
	 * @returns A Promise that resolves to the hashed data.
	 */
	public async make(data: string, saltOrRounds: string | number = 10): Promise<string> {
		return await this.provider.make(data, saltOrRounds);
	}

	/**
	 * Compares a plain text string with an encrypted string to check if they match.
	 * @param data The plain text string to compare.
	 * @param encrypted The encrypted string to compare against.
	 * @returns {Promise<boolean>} that resolves to a boolean indicating whether the strings match.
	 */
	public async compare(data: string, encrypted: string): Promise<boolean> {
		return await this.provider.compare(data, encrypted);
	}
}