import { IsNotEmpty, IsString, IsEmail, Length, Matches } from 'class-validator';

export class RegisterRequest {
	avatar?: string;

	@IsString()
	@IsNotEmpty()
		firstName!: string;

	@IsString()
	@IsNotEmpty()
		lastName!: string;

	@IsEmail({}, {
		message: 'please provide a valid email!'
	})
	@IsNotEmpty({
		message: 'email is required!'
	})
		email!: string;

	@Matches(/[0-9]{1,}/, {
		message: 'Password must contain at least one number',
	})
	@Length(6, 50)
	@IsString()
	@IsNotEmpty({
		message: 'password is required!'
	})
		password!: string;
}
