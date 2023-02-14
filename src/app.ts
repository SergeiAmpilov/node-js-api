import express, { Express } from 'express';
import { Server } from 'http';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILogger } from './logger/logger.interface';
// import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';


export class App {
  app: Express;
  port: number;
  server: Server;
  logger: ILogger;
  usersController: UsersController;
  exeptionFilter: ExeptionFilter

  constructor(
    logger: ILogger,
    usersController: UsersController,
    exeptionFilter: ExeptionFilter
    ) {
    this.app = express();
    this.port = process.env.PORT ? Number(process.env.PORT) : 8000;
    this.logger = logger;
    this.usersController = usersController;
    this.exeptionFilter = exeptionFilter;
  }
  
  useRoutes() {
    this.app.use('/users', this.usersController.router);
  }

  useExeptionFilters() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  public async init() {
    this.useRoutes();
    this.useExeptionFilters();
    this.server = this.app.listen(this.port, () => {
      this.logger.log(`Server has been started on http://localhost:${this.port}`);
    });
  }
}