import {
	Get,
	JsonController,
	OnNull,
	QueryParams,
	UseBefore,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { ClientService } from '@/services/clients/ClientService';
import { User } from '@/entities/User';
import { PaginatedRequest } from '@/types/requests/PaginatedRequest';
import { IPaginatedResult } from '@/types/dtos/IPaginatedResult';
import { AuthCheck } from '@/middlewares/auth/AuthCheck';
import { LoggedUser } from '@/decorators/LoggedUser';
import { ILoggedUser } from '@/types/dtos/ILoggedUser';
import { AdminCheck } from '@/middlewares/auth/AdminCheck';

@Service()
@OpenAPI({
	security: [{ bearerAuth: [] }],
})
@JsonController('/users')
@UseBefore(AuthCheck)
@OnNull(404)
export class UserController {
	constructor(private clientService: ClientService) { }

	@Get()
	@UseBefore(AdminCheck)
	public async getAll(
		@QueryParams() queryParams: PaginatedRequest
	): Promise<IPaginatedResult<User>> {
		const params = queryParams.getAll();
		const clients = await this.clientService.getAll(params);

		return {
			...clients,
			currentPage: Number(queryParams.page) || 1,
			pageSize: params.take,
		};
	}

	@Get('/me')
	public async getMe(@LoggedUser() loggedUser: ILoggedUser): Promise<ILoggedUser | null> {
		return await this.clientService.getById(loggedUser.userId);
	}
}
