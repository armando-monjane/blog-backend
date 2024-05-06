import express from 'express';
import path from 'path';
import { useContainer as routingControllersUseContainer, useExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { Container } from 'typedi';
import helmet from 'helmet';
import passport from 'passport';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUiExpress from 'swagger-ui-express';

import { appConfig } from '@/config/app';
import { authConfig } from '@/config/auth';
import { AppDataSource } from '@/data-source';

export class App {
	public app: express.Application = express();

	public async bootstrap(): Promise<void> {
		try {
			await this.typeOrmCreateConnection();
			this.useContainers();
			this.setupMiddlewares();
			this.serveStaticFiles();
			this.registerControllers();
			this.setupSwagger();
			this.register404Route();
		} catch (error) {
			console.error('Error during bootstrap:', error);
			process.exit(1);
		}
	}

	private useContainers() {
		routingControllersUseContainer(Container);
	}

	private async typeOrmCreateConnection() {
		try {
			if (!appConfig.isProduction) {
				console.log('Connecting Database...');
			}

			await AppDataSource.initialize()
				.then(() => {
					if (!appConfig.isProduction) {
						console.log('Database connection established');
					}
				})
				.catch((err) => {
					console.error('Error connecting Database:', err);
					// process.exit(1);
				});
		} catch (err) {
			console.error('Error connecting Database', err)
		}
	}

	private setupMiddlewares() {
		// Helmet is used to secure this app by configuring the http-header
		this.app.use(helmet({
			crossOriginResourcePolicy: false,
		}));

		// parse json request body
		this.app.use(express.json());

		// parse urlencoded request body
		this.app.use(express.urlencoded({ extended: true }));

		// Passport to handle jwt authentication
		const options: StrategyOptions = {
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: authConfig.providers.jwt.secret,
		};

		const strategy = new Strategy(options, (payload: object, done) => {
			done(null, payload);
		});

		passport.use(strategy);
		this.app.use(passport.initialize());
	}

	private registerControllers() {
		useExpressServer(this.app, {
			validation: { stopAtFirstError: true },
			cors: true,
			classTransformer: true,
			defaultErrorHandler: false,
			routePrefix: appConfig.routePrefix,
			controllers: [`${__dirname}${appConfig.controllersDir}`],
			middlewares: [`${__dirname}${appConfig.middlewaresDir}`],
		});
	}

	private register404Route() {
		this.app.get('*', (_req, res) => {
			if (!res.headersSent) {
				res.status(404).send({ status: 404, message: 'Not Found!' });
			}
		});
	}


	private setupSwagger() {
		// Parse class-validator classes into JSON Schema
		const schemas = validationMetadatasToSchemas() as { [key: string]: any; };

		// Parse routing-controllers classes into OpenAPI spec:
		const storage = getMetadataArgsStorage();
		const spec = routingControllersToSpec(
			storage,
			{ routePrefix: appConfig.routePrefix },
			{
				components: {
					schemas,
					securitySchemes: {
						bearerAuth: {
							type: 'http',
							scheme: 'bearer',
							bearerFormat: 'JWT',
						},
					},
				},
				info: {
					description: 'Express REST API',
					title: 'API Documentation',
					version: '0.0.1'
				},
			},
		);

		// Use Swagger UI for express
		const { serve } = swaggerUiExpress;
		this.app.use('/docs', serve, swaggerUiExpress.setup(spec));
	}

	private serveStaticFiles() {
		this.app.use('/public', express.static(path.join(appConfig.uploadDirectory), { maxAge: 31557600000 }));
	}
}

export default new App();