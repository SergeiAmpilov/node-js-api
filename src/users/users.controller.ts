import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { IControllerRoute } from '../common/route.interface';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserService } from './users.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { GuardMiddleware } from '../common/guard.middleware';

@injectable()
export class UsersController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UsersService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService
		) {
		super(loggerService);

		const routesDate: IControllerRoute[] = [
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new GuardMiddleware()],
			},
		];

		this.bindRoutes(routesDate);
	}

	async login({ body }: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
		const resLogin = await this.userService.validateUser(body);

		if (!resLogin) {
			return next(new HTTPError(401, 'error while login'));
		}

		const jwt = await this.signJwt(body.email, this.configService.get('SECRET') );

		this.ok(res, { jwt });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction): Promise<void> {
			const result = await this.userService.createUser(body);

			if (!result) {
				return next(new HTTPError(422, 'This user allready exists'));
			}		
		
			this.ok(res, { email: result.email, id: result.id });
	}

	async info (req: Request, res: Response, next: NextFunction): Promise<void> {
		//
		const userFound = await this.userService.findUserByEmail(req.user);

		if (userFound) {
			this.ok(res, {user: userFound});		
		} else {
      res.status(404).send('No user found ?!');
		}
	};


	private signJwt(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {

			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256'
				},
				(err, token) => {
					if (err) {
						reject(err);
					}

					resolve(token as string);
				});

		});

	}
}
