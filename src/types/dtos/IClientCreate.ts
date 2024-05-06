import { IPhoto } from '@/types/dtos/IPhoto';

export interface IClientCreate {
	avatar: string;
	role: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	photos: IPhoto[];
}
