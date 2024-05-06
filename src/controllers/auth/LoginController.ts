import { JsonController, Body, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { LoginService } from '@/services/auth/LoginService';
import { OpenAPI } from 'routing-controllers-openapi';
import { LoginRequest } from '@/types/requests/LoginRequest';

@Service()
@OpenAPI({
	tags: ['Auth'],
})
@JsonController('/login')
/**
 * Controller for handling user login requests.
 */
export class LoginController {
	public constructor(private loginService: LoginService) {}

    @Post()
	/**
	 * Logs in a user with the provided credentials.
	 * @param LoginRequest The user credentials to log in.
	 * 
	 * @returns A Promise that resolves to the logged in user.
	 */
	/**
	 * Logs in a user.
	 * @param {LoginRequest} user - The user to be logged in.
	 * @returns {Promise<ILoggedUser>} - A promise that resolves to the result of the login operation.
	 */
	public async login(@Body() user: LoginRequest) {
		return await this.loginService.login(user);
	}
}