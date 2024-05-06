import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Service } from 'typedi';
import { NextFunction, Response } from 'express';
import passport from 'passport';
import { IRequest } from '@/infrastructure/interfaces/IRequest';


@Service()
export class AuthCheck implements ExpressMiddlewareInterface {
	use(request: IRequest, response: Response, next: (err?: Error) => NextFunction): any {

		const authenticate: unknown = passport.authenticate('jwt', { session: false }, (err: Error, user: { role: string, userId: number, email: string }) => {
			if (err) {
				return next(err);
			}

			if (!user) {
				return response.status(401).send({ status: 401, message: 'Unauthorized!' });
			}

			request.loggedUser = user;

			return next();
		});

		if (authenticate && typeof authenticate === 'function') {
			authenticate(request, response, next)
		}
	}
}