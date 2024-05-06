import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Post } from '@/entities/Post';

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    filename!: string;

    @Column()
    url!: string;

    @ManyToOne(() => Post, post => post.photos)
    post!: Post;
}
