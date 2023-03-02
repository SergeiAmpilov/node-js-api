import { Container } from "inversify";
import { ContainerModule } from "inversify/lib/container/container_module";
import { interfaces } from "inversify/lib/interfaces/interfaces";
import { App } from "./app";
import { ExeptionFilter } from "./errors/exeption.filter";
import { IExeptionFilter } from "./errors/exeption.filter.interface";
import { ILogger } from "./logger/logger.interface";
import { LoggerService } from "./logger/logger.service";
import { TYPES } from "./types";
import { UsersController } from "./users/users.controller";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService);
  bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
  bind<UsersController>(TYPES.UsersController).to(UsersController);
  bind<App>(TYPES.Application).to(App);
});

function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application);
  app.init();

  return { app, appContainer};
}

export const { app, appContainer } = bootstrap();
