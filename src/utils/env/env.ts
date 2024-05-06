import * as dotenv from 'dotenv';
dotenv.config();

export const env = (key: string, defaultValue: null | string = null): string => process.env[key] ?? (defaultValue as string)

export const envOrFail = (key: string): string => {
	if (typeof process.env[key] === 'undefined') {
		throw new Error(`Environment variable ${key} is not set.`);
	}

	return process.env[key] as string;
}