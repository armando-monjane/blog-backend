import { authConfig } from '@/config/auth';
import * as jwt from 'jsonwebtoken';
import { IAuthProvider } from '@/services/auth/providers/IAuthProvider';

/**
 * JWTProvider class that implements the IAuthProvider interface.
 * This class is responsible for signing payloads using JSON Web Tokens (JWT).
 */
export class JWTProvider implements IAuthProvider {
	public sign(payload: object): object {
		return {
			access_token: jwt.sign(payload, authConfig.providers.jwt.secret, {
				expiresIn: authConfig.providers.jwt.expiresIn,
			}),
			expires_in: authConfig.providers.jwt.expiresIn,
		};
	}
}