import { UnauthorizedError } from 'routing-controllers';

export class InvalidCredentialsException extends UnauthorizedError {
	constructor(message = 'Invalid credentials!') {
		super(message);
	}
}