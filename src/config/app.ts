import { env } from '@/utils/env';

const getAppPath = () => {
	let currentDir = __dirname;
	currentDir = currentDir.replace('/config', '');

	return currentDir;
};

export const appConfig = {
	node: env('NODE_ENV') || 'development',
	isProduction: env('NODE_ENV') === 'production',
	isStaging: env('NODE_ENV') === 'staging',
	isDevelopment: env('NODE_ENV') === 'development',
	name: env('APP_NAME'),
	port: Number(env('APP_PORT')),
	routePrefix: env('APP_ROUTE_PREFIX'),
	url: env('APP_URL'),
	appPath: getAppPath(),
	uploadDirectory: env('UPLOAD_DIRECTORY'),
	entitiesDir: env('TYPEORM_ENTITIES_DIR'),
	controllersDir: env('CONTROLLERS_DIR'),
	middlewaresDir: env('MIDDLEWARES_DIR'),
};
