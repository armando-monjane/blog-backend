import { Category } from '@/entities/Category';
import { AppDataSource } from '@/data-source';

export const CategoryRepository = AppDataSource.getRepository(Category);