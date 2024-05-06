import { authConfig } from '@/config/auth';
import { Service } from 'typedi';
import { JWTProvider, IAuthProvider } from '@/services/auth/providers';

/**
 * Service responsible for handling authentication logic.
 */
@Service()
export class AuthService {
	private provider!: IAuthProvider;

	public constructor() {
		this.setProvider(authConfig.defaultProvider);
	}

	/**
	 * Sets the authentication provider to be used by the service.
	 * @param provider - The authentication provider to be used.
	 */
	public setProvider(provider: string): this {
		switch (provider) {
		case 'jwt':
			this.provider = new JWTProvider();
			break;

		default:
			this.provider = new JWTProvider();
			break;
		}

		return this;
	}

	
	/**
	 * Signs a payload using the provider's sign method.
	 * @param payload - The payload to be signed.
	 * @returns The signed payload.
	 */
	public sign(payload: object): object {
		return this.provider.sign(payload);
	}
}