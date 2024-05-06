import { Request } from 'express';

export interface IRequest extends Request {
	loggedUser: {
        userId: number;
        email: string;
        role: string;
    };
}