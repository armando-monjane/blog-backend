import { ExpressErrorMiddlewareInterface, Middleware, HttpError } from 'routing-controllers';
import * as express from 'express';
import { Service } from 'typedi';

type ResponseObject = {
	success: boolean;
	status: number;
	message?: string;
	errors?: any;
	stack?: string;
}

type ValidationError = {
	property: string;
	constraints: {
		[key: string]: string;
	}
	[key: string]: object | string;
}

type CustomError =  Error & { httpCode?: number; errors?: []; stack?: string; }

@Service()
@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
	public error(error: CustomError, _req: express.Request, res: express.Response) {
		const responseObject = {} as ResponseObject;
		responseObject.success = false;

		// Status code
		if (error instanceof HttpError && error.httpCode) {
			responseObject.status = error.httpCode;
			res.status(error.httpCode);
		} else {
			responseObject.status = 500;
			res.status(500);
		}


		responseObject.message = error.message;

		// Class validator handle errors
		if (responseObject.status == 400) {
			const validatorErrors = {} as ValidationError;
			if (typeof error === 'object' && error?.errors) {
				error.errors.forEach((element: ValidationError) => {
					if (element.property && element.constraints) {
						validatorErrors[element.property] = element.constraints;
					}
				});
			}
			responseObject.errors = validatorErrors;
		}

		// Append stack
		if (error.stack && process.env.NODE_ENV === 'development' && responseObject.status == 500) {
			responseObject.stack = error.stack;
		}

		// Final response
		res.json(responseObject);
	}
}