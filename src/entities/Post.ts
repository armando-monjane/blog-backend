import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Photo } from '@/entities/Photo';
import { User } from '@/entities/User';
import { Category } from '@/entities/Category';


@Entity()
export class Post {
    @PrimaryGeneratedColumn()
	id!: number
    
    @Column({
    type: 'varchar',
    })
    thumbnail!: string;

    @Column({
    type: 'varchar',
    })
    title!: string;

    @Column({
        type: 'varchar',
    })
    content!: string;


    @Column()
    categoryId!: number;

    @OneToMany(() => Photo, photo => photo.post)
	photos!: Photo[]
    
    @ManyToOne(() => User, user => user.posts)
    user!: User;

    @ManyToOne(() => Category, category => category.posts)
    category!: Category;

    @CreateDateColumn({
		type: 'timestamp',
		name: 'created_at',
	})
	createdAt!: Date

	@UpdateDateColumn({
		type: 'timestamp',
		name: 'updated_at',
	})
	updatedAt!: Date
}