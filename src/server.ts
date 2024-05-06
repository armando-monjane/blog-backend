import 'reflect-metadata'
import { Server } from 'http';
import { appConfig } from '@/config/app';
import App from '@app';

const initServer = async () => {
	await App.bootstrap();
	const { app } = App;

	const { port = 3000 } = appConfig;

	const server: Server = app.listen(port, (): void => {
		console.log(`🚀 Application listening on PORT: ${port}\nEnvironment: ${process.env.NODE_ENV}`);
		//  TODO: add logger and remove console.logs
		// logger.info(`🚀 Application listening on PORT: ${port}\nEnvironment: ${process.env.NODE_ENV}`);
	});
	
	const exitHandler = () => {
		server.close(() => {
			console.log('Server closed');
			// logger.info('Server closed');
			process.exit(1);
		});
	};
	
	const unexpectedErrorHandler = (error: Error) => {
		console.error(error);
		// logger.error(error);
		exitHandler();
	};
	
	process.on('uncaughtException', (err) => unexpectedErrorHandler(err));
	process.on('unhandledRejection', (reason: Error) => {
		throw reason;
	});
	
	process.on('SIGTERM', () => {
		console.log('SIGTERM received');
		//   logger.info('SIGTERM received');
		if (server) {
			server.close();
		}
	});
}

void initServer();