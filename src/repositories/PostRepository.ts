import { Post } from '@/entities/Post';
import { AppDataSource } from '@/data-source';

export const PostRepository = AppDataSource.getRepository(Post);