import express, { Express } from 'express';
import { router as userRouter } from './users/users.js';
import { Server } from 'http';


export class App {
  app: Express;
  port: number;
  server: Server;

  constructor() {
    this.app = express();
    this.port = 8000;
  }
  
  useRoutes() {
    this.app.use('/users', userRouter);
  }

  public async init() {
    this.useRoutes();
    this.server = this.app.listen(this.port, () => {
      console.log(`Server has been started on http://localhost:${this.port}`);
    });
  }
}