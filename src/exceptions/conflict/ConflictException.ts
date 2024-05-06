import { HttpError } from 'routing-controllers';

export class ConflictException extends HttpError {
	constructor(message: string = 'Request could not be completed due to a conflict.') {
		super(409, message);
	}
}