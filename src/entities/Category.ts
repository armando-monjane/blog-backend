import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Post } from '@/entities/Post';


@Entity()
export class Category {
    @PrimaryGeneratedColumn()
	id!: number
    
    @Column({
    type: 'varchar',
    })
    name!: string;

    @OneToMany(() => Post, post => post.category)
    posts!: Post[]

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
