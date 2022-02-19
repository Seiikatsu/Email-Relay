process.env["NODE_CONFIG_DIR"] = __dirname + "/configs";

import compression from "compression";
import config from "config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import {Routes} from "./interfaces/routes.interface";
import authMiddleware from "./middlewares/auth.middleware";
import errorMiddleware from "./middlewares/error.middleware";
import {logger, stream} from "./utils/logger";

function wildcardToRegExp(wildcard) {
	// https://stackoverflow.com/a/57527468
	const exp: string = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&') // regexp escape
		.replace(/\*./g, '(.*\.)?'); // *. with optional regex

	// example regexp:
	// /^(https?:\/\/)?(.*\.)?plusk\.at$/i
	return new RegExp(`^(https?:\\/\\/)?${exp}$`, 'i');
}

class App {
	public app: express.Application;
	public port: string | number;
	public env: string;

	constructor(routes: Routes[]) {
		this.app = express();
		this.port = process.env.PORT || 3000;
		this.env = process.env.NODE_ENV || "development";
		if (this.env === "production") {
			this.app.set("trust proxy", 1);
		}

		this.initializeMiddlewares();
		this.initializeRoutes(routes);
		this.initializeErrorHandling();
	}

	public listen() {
		this.app.listen(this.port, () =>
			logger.info(`App listening on port ${this.port}`)
		);
	}

	public getServer() {
		return this.app;
	}

	private initializeMiddlewares() {
		if (this.env === "production") {
			this.app.use(
				rateLimit({
					windowMs: 15 * 60 * 1000, // 15 minutes
					max: 5,
				})
			);
		}

		let whitelistedDomains: RegExp[] | undefined;
		this.app.use(morgan(config.get("log.format"), {stream}));
		this.app.use(
			cors((req, callback) => {
				if (whitelistedDomains === undefined) {
					const origin = config.get('cors.origin');
					if (typeof origin === 'string') {
						whitelistedDomains = [wildcardToRegExp(origin)];
					} else if (Array.isArray(origin)) {
						whitelistedDomains = origin.map(wildcardToRegExp);
					} else if (typeof origin === 'boolean' && !!origin) {
						whitelistedDomains = [
							/([^\s])/ // allow all not empty
						];
					} else {
						whitelistedDomains = [];
					}
				}

				let corsOptions: cors.CorsOptions;
				if (whitelistedDomains.some((regExp) => regExp.test(req.header('Origin')))) {
					corsOptions = {
						origin: true,
						credentials: config.get('cors.credentials'),
					}
				} else {
					corsOptions = {
						origin: false,
					};
				}
				callback(null, corsOptions);
			})
		);
		this.app.use(helmet());
		this.app.use(compression());
		this.app.use(express.json());
		this.app.use(express.urlencoded({extended: true}));
		this.app.use(cookieParser());
		this.app.use(authMiddleware);
	}

	private initializeRoutes(routes: Routes[]) {
		routes.forEach((route) => {
			this.app.use("/", route.router);
		});
	}

	private initializeErrorHandling() {
		this.app.use(errorMiddleware);
	}
}

export default App;
