import { env } from '@/utils/env';

export const hashingConfig = {
	defaultDriver: env('HASHING_DEFAULT_DRIVER', 'bcrypt'),

	disks: {
		bcrypt: {
			defaultRounds: env('HASH_SALT', '10'),
		},
	},
};
