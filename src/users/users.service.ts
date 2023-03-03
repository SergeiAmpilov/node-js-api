import { inject, injectable } from "inversify";
import { IConfigService } from "../config/config.service.interface";
import { TYPES } from "../types";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { IUserService } from "./users.service.interface";

@injectable()
export class UserService implements IUserService {

  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {}
  
  async createUser ({ email, name, password }: UserRegisterDto): Promise<User | null> {
    
    const newUser = new User(email, name);
		await newUser.setPassword(password);

    // check user exists. if exists - return null. else - create new and return User
    return null;
  };

  async validateUser({ }: UserLoginDto): Promise<boolean> {
    return true;
  };

}