import { Photo } from '@/entities/Photo';

export interface ILoggedUser {
    userId: number;
    fullName: string;
    email: string;
    accessToken?: string;
    photos?: Photo[];
}
