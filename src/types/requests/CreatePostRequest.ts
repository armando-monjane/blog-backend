import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreatePostRequest {

    @IsString()
    @IsNotEmpty({
        message: 'title is required!'
    })
        title!: string;

    @IsString()
    @IsNotEmpty({
        message: 'content is required!'
    })
        content!: string;

    @IsNumber()
    @IsNotEmpty({
        message: 'category is required!'
    })
        categoryId!: number;

    @IsString()
    @IsNotEmpty({
        message: 'thumbnail is required!'
    })
        thumbnail!: string;

    
}