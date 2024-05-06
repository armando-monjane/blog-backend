import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Service } from 'typedi';
import { Response } from 'express';
import { IRequest } from '@/infrastructure/interfaces/IRequest';

@Service()
export class AdminCheck implements ExpressMiddlewareInterface {
	use(request: IRequest, response: Response, next: (err?: any) => any): any {
		const { loggedUser } = request;

		if (!loggedUser) {
			return response.status(401).send({ status: 401, message: 'Unauthorized!' });
		}

		if (loggedUser?.role !== 'admin') {
			return response.status(403).send({ status: 403, message: 'Forbidden!' });
		}

		next();
	}
}