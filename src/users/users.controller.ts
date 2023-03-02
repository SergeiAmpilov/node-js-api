import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { IControllerRoute } from "../common/route.interface";
import { HTTPError } from "../errors/http-error.class";
import { LoggerService } from "../logger/logger.service";


export class UsersController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);

    const routesDate: IControllerRoute[] = [
      {
        path: '/login',
        method: 'post',
        func: this.login,
      },
      {
        path: '/register',
        method: 'post',
        func: this.register,
      },
    ];

    
    this.bindRoutes(routesDate);
  }
  
  login(req: Request, res: Response, next: NextFunction) {
    next(new HTTPError(401, 'No auth user', 'login user'));
    // this.ok(res, 'login')
  }

  register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, 'register')
  }
}