import { Service } from 'typedi';
import { JsonController, Body, Post, UploadedFiles, HttpCode } from 'routing-controllers';

import { OpenAPI } from 'routing-controllers-openapi';
import { RegisterService } from '@/services/auth/RegisterService';
import { RegisterRequest } from '@/types/requests/RegisterRequest';
import { IFile } from '@/types/dtos/IFile';
import { ILoggedUser } from '@/types/dtos/ILoggedUser';

@Service()
@OpenAPI({
	tags: ['Auth'],
})
@JsonController('/register')
export class RegisterController {
	public constructor(private registerService: RegisterService) { }

	/**
	 * Registers a new user with the provided registration data and files.
	 * Receives a multipart/form-data request with the following fields:
	 * @param {IFile[]} files - The files uploaded during registration.
	 * @param {RegisterRequest} registerRequest - The registration data.
	 * @returns {Promise<ILoggedUser>} - A Promise that resolves to the result of the registration with status code 201.
	 * @throws {BadRequestException} - If the provided data is invalid.
	 * @throws {ConflictException} - If the provided email is already in use.
	 */
	@HttpCode(201)
	@Post()
	public async register(
        @UploadedFiles('files') files: IFile[],
        @Body() registerRequest: RegisterRequest,
	): Promise<ILoggedUser>{
		return await this.registerService.register(registerRequest, files);
	}
}
