import {
    Body,
	Get,
	HttpCode,
	JsonController,
	OnNull,
	Post,
	UploadedFiles,
	UseBefore,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { AuthCheck } from '@/middlewares/auth/AuthCheck';
import { ILoggedUser } from '@/types/dtos/ILoggedUser';
import { IFile } from '@/types/dtos/IFile';
import { CreatePostRequest } from '@/types/requests/CreatePostRequest';
import { PostService } from '@/services/post/PostService';
import { IPost } from '@/types/dtos/IPost';
import { LoggedUser } from '@/decorators/LoggedUser';

@Service()
@OpenAPI({
	security: [{ bearerAuth: [] }],
})
@JsonController('/posts')
@OnNull(404)
export class PostController {
	constructor(private postService: PostService) { }

    @HttpCode(201)
    @UseBefore(AuthCheck)
	@Post()
	public async createPost(
        @UploadedFiles('files') files: IFile[],
        @Body() createPostRequest: CreatePostRequest,
        @LoggedUser() loggedUser: ILoggedUser
	): Promise<IPost>{
		return await this.postService.create(createPostRequest, files, loggedUser.userId);
	}

    @HttpCode(201)
    @UseBefore(AuthCheck)
	@Post('/bulk')
    public async createBulkPosts(
        @Body() createPostRequests: CreatePostRequest[],
        @LoggedUser() loggedUser: ILoggedUser
    ): Promise<IPost[]> {
        return await this.postService.createBulk(createPostRequests, loggedUser.userId);
    }


    @Get('/:id')
    public async getPostById(id: number): Promise<IPost | null> {
        return await this.postService.getById(id);
    }
    

    // @Post('/me')
    // public async getMyPosts(
    //     @LoggedUser() loggedUser: ILoggedUser
    // ): Promise<IPost[]> {
    //     return await this.postService.getMyPosts(loggedUser.userId);
    // }
}
