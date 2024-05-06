import * as fs from 'fs';
import path from 'path';
import { env } from 'process';

import { appConfig } from '@/config/app';

import { Post } from '@/entities/Post';

import { PostRepository } from '@/repositories/PostRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { ClientRepository } from '@/repositories/ClientRepository';

import { IPost } from '@/types/dtos/IPost';
import { CreatePostRequest } from '@/types/requests/CreatePostRequest';
import { Service } from 'typedi';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import { IFile } from '@/types/dtos/IFile';
import { IPhoto } from '@/types/dtos/IPhoto';
import { Photo } from '@/entities/Photo';
import { Category } from '@/entities/Category';

@Service()
export class PostService {

	constructor() { }

	async getById(id: number): Promise<IPost | null> {
		const post = await PostRepository.findOne({
			where: { id },
			select: { ...this.objectToSelect()},
			relations: ['photos', 'user', 'category']
		});

		if (!post) return null;

		return {
			id: post.id,
            title: post.title,
            content: post.content,
            category: {
                id: post.category.id,
                name: post.category.name,
            },
            author: {
                id: post.user.id,
                fullName: `${post.user.firstName} ${post.user.lastName}`,
                email: post.user.email,
            },
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            photos: post.photos,
		};
	}

    async create(post: CreatePostRequest, files: IFile[], userId: number): Promise<IPost> {
        const existingCategory = await CategoryRepository.findOne({
            where: { id: post.categoryId }
        });

        // fetch default category
        const defaultCategory = await CategoryRepository.findOne({
            where: { name: 'General' }
        });

        if (!existingCategory && !defaultCategory) {
            throw new NotFoundError('Default category not found');
        }

        const existingUser = await ClientRepository.findOne({
            where: { id: userId }
        });

        if (!existingUser) {
            throw new NotFoundError('User not found');
        }

        const newPost = new Post();
        newPost.title = post.title;
        newPost.content = post.content;
        newPost.category = existingCategory || defaultCategory as Category; // Add type assertion here
        newPost.user = existingUser;
        newPost.thumbnail = post.thumbnail;

        return await PostRepository.manager.transaction(async (transactionalEntityManager) => {
			const photos = files ? this.generatePhotos(files) : [];
			newPost.photos = photos as unknown as Photo[];

			// TODO: fix type to avoid this cast
			const postToBeCreated = transactionalEntityManager.create<Post>(Post, newPost as unknown as Post);
			const createdPost = await transactionalEntityManager.save<Post>(postToBeCreated);

			await this.uploadFiles(photos);

			return {
                ...createdPost,
                author: {
                    id: createdPost.id,
                    fullName: `${existingUser.firstName} ${existingUser.lastName}`,
                    email: existingUser.email,
                },
                category: {
                    id: newPost.category.id,
                    name: newPost.category.name,
                },
            }
		});
    }

    async createBulk(posts: CreatePostRequest[], userId: number): Promise<IPost[]> {
        const existingUser = await ClientRepository.findOne({
            where: { id: userId }
        });

        if (!existingUser) {
            throw new NotFoundError('User not found');
        }

        const defaultCategory = await CategoryRepository.findOne({
            where: { name: 'General' }
        });

        const newPosts = posts.map(post => {
            return {
                title: post.title,
                content: post.content,
                categoryId: post.categoryId || defaultCategory?.id,
                user: existingUser,
                thumbnail: post.thumbnail,
            }
        });

        return await PostRepository.manager.transaction(async (transactionalEntityManager) => {
            const createdPosts = await transactionalEntityManager.save(newPosts);

            return createdPosts.map(post => ({
                ...post,
                author: {
                    id: post.user.id,
                    fullName: `${post.user.firstName} ${post.user.lastName}`,
                    email: post.user.email,
                },
            })) as unknown as IPost[];
        });
    }


	async getAllByUser(params?: object): Promise<{ data: IPost[], totalRows: number }> {
		const [data, totalRows] = await PostRepository.findAndCount({
			...params,
			select: { ...this.objectToSelect() },
            relations: ['photos', 'user', 'category']
		});

        const mappedData = data.map(post => ({
            ...post,
            author: {
                id: post.user.id,
                fullName: `${post.user.firstName} ${post.user.lastName}`,
                email: post.user.email,
            },
            category: {
                id: post.category.id,
                name: post.category.name,
            },
            photos: post.photos,
        }));
		
        return { data: mappedData, totalRows };
	}

	/**
	 * Returns an object with the properties to be selected from the client entity.
	 * 
	 * @returns {object} An object with the properties to be selected.
	 */
	private objectToSelect(): object {
		return {
			id: true,
			title: true,
			content: true,
			createdAt: true,
			updatedAt: true,
		};
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