import { IRequest } from '@/infrastructure/interfaces/IRequest';
import { createParamDecorator } from 'routing-controllers';


/**
 * A decorator that retrieves the logged user from the request object.
 * @returns paramDecorator - A param decorator that retrieves the logged user from the request object.
 */
export const LoggedUser = () => createParamDecorator({
	value: (action) => {
		const { loggedUser } = action.request as IRequest;
		return loggedUser;
	},
});