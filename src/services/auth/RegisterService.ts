import * as fs from 'fs';
import path from 'path';
import { env } from 'process';

import { appConfig } from '@/config/app';
import { ClientRepository } from '@/repositories/ClientRepository';
import { RegisterRequest } from '@/types/requests/RegisterRequest';
import { Service } from 'typedi';
import { AuthService } from '@/services/auth/AuthService';
import { HashService } from '@/services/hash/HashService';
import { AuthResult } from '@/types/dtos/AuthResult';
import { IClientCreate } from '@/types/dtos/IClientCreate';
import { User } from '@/entities/User';
import { IFile } from '@/types/dtos/IFile';
import { IPhoto } from '@/types/dtos/IPhoto';
import { BadRequestError } from 'routing-controllers';
import { UserRole } from '@/entities/UserRole';
import { ILoggedUser } from '@/types/dtos/ILoggedUser';
import { ConflictException } from '@/exceptions/conflict/ConflictException';

@Service()
export class RegisterService {
	/**
	 * Service responsible for handling client register.
	 * @param {AuthService} authService - An instance of the authentication service.
	 * @param {HashService} hashService - An instance of the hash service.
	 */
	constructor(
		private authService: AuthService,
		private hashService: HashService
	) {}

	/**
	 * Registers a new client with the given information and files.
	 * @param request - The request containing the client information.
	 * @param files - The files to be uploaded for the client.
	 * @returns An object containing the registered client's information and access token.
	 * @throws {BadRequestError} if the given request body is invalid.
	 * @throws {ConflictException} if an account with the given email already exists.
	 */
	async register(request: RegisterRequest, files: IFile[]): Promise<ILoggedUser> {
		const userByEmail = await ClientRepository.findByEmail(request.email);
		if (userByEmail) {
			throw new ConflictException(`Account with email ${request.email} already exists! Please login instead.`);
		}

		const client: IClientCreate = {
			...request,
			role: UserRole.CLIENT,
			password: await this.hashService.make(request.password),
			photos: [],
			avatar: request.avatar || 'https://www.gravatar.com/avatar',
		};

		return await ClientRepository.manager.transaction(async (transactionalEntityManager) => {
			const photos = files ? this.generatePhotos(files) : [];
			client.photos = photos;

			// TODO: fix client type to avoid this cast
			const clientToBeCreated = transactionalEntityManager.create<User>(User, client as unknown as User);
			const registeredClient = await transactionalEntityManager.save<User>(clientToBeCreated);

			await this.uploadFiles(photos);

			const { email, role, firstName, lastName } = registeredClient;

			const { access_token } = this.authService.sign({
				userId: registeredClient.id,
				email,
				role,
			}) as AuthResult;

			return {
				userId: registeredClient.id,
				email,
				fullName: firstName + ' ' + lastName,

				accessToken: access_token,
			};
		});
	}

	/**
	 * Uploads the given photos to the server.
	 * @param photos - The photos to be uploaded.
	 * @returns A Promise that resolves when all photos have been uploaded.
	 */
	private async uploadFiles(photos: IPhoto[]): Promise<void> {
		const uploadDir = path.join(appConfig.uploadDirectory);

		// Create uploads directory if it doesn't exist
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir);
		}

		for (const photo of photos) {
			// Handle each file
			const filePath = path.join(uploadDir, photo.url);

			const writeStream = fs.createWriteStream(filePath);
			await new Promise<void>((resolve, reject) => {
				writeStream.on('finish', () => {
					resolve();
				});
				writeStream.on('error', (error) => {
					reject(error);
				});
				writeStream.write(photo.buffer);
				writeStream.end();
			});
		}
	}

	/**
	 * Generates an array of photos from the given files.
	 * @param files - The files to be converted to photos.
	 * @returns An array of photos.
	 */
	private generatePhotos(files: IFile[]): IPhoto[] {
		return files.map((file) => ({
			url: `${Date.now()}-${file.originalname}`,
			name: file.originalname,
			buffer: file.buffer,
		}));
	}
}
