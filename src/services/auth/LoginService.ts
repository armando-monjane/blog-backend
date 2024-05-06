import { Service } from 'typedi';
import { AuthService } from '@/services/auth/AuthService';
import { LoginRequest } from '@/types/requests/LoginRequest';
import { HashService } from '@/services/hash/HashService';
import { InvalidCredentialsException } from '@/exceptions/auth/InvalidCredentialsException';
import { ClientRepository } from '@/repositories/ClientRepository';
import { AuthResult } from '@/types/dtos/AuthResult';
import { ILoggedUser } from '@/types/dtos/ILoggedUser';

@Service()
export class LoginService {
	/**
	 * Service responsible for handling user login.
	 * @param {HashService} hashService - An instance of the hash service.
	 * @param {AuthService} authService - An instance of the authentication service.
	 */
	constructor(
		private authService: AuthService,
		private hashService: HashService
	) {}

	/**
	 * Authenticates a user and returns a logged user object.
	 * @param {LoginRequest} data - The login request data.
	 * @returns {Promise<ILoggedUser>} - A promise that resolves to a logged user object.
	 * @throws {InvalidCredentialsException} - If the provided credentials are invalid.
	 */
	public async login(data: LoginRequest): Promise<ILoggedUser> {
		const client = await ClientRepository.findOne({
			where: {
				isActive: true,
				email: data.email,
			},
		});

		if (!client) {
			throw new InvalidCredentialsException();
		}

		if (!(await this.hashService.compare(data.password, client.password))) {
			throw new InvalidCredentialsException();
		}

		const { email, role, firstName, lastName } = client;
		const { access_token } = this.authService.sign({
			userId: client.id,
			email,
			role,
		}) as AuthResult;

		return {
			userId: client.id,
			email,
			fullName: firstName + ' ' + lastName,
			accessToken: access_token,
		};
	}
}
