import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";
import { IExeptionFilter } from "./exeption.filter.interface";
import { HTTPError } from "./http-error.class";

export class ExeptionFilter implements IExeptionFilter {
  
  logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;
  }

  catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction) {
    let errMsg = err.message;
    let errCode = 500;

    if (err instanceof HTTPError) {
      errCode = err.statusCode;
      errMsg = `[${err.context}] Ошибка: ${errCode} ${err.message}`;      
    } 
    
    this.logger.error(errMsg);
    res.status(errCode).send({ err: errMsg});   
  }
}