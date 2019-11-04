import { decodeToken, generateToken, hash, verifyToken } from "../../libs/encryption";
import { ISigninInput, ISignupInput, ISignoutInput, IValidateTokenInput } from "./models";
import UserRepository from "../../repositories/user/UserRepository";
import { BadRequestError } from "../../models/errors";
import { UnauthorizedResponse } from "../../models/responses";

class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async signup({ body }: ISignupInput) {
    console.debug("UserController - signup", JSON.stringify(body));

    const existingUser = await this.userRepository.getByUserName(body.username);

    if (existingUser) {
      return new UnauthorizedResponse("user already exists!");
    }

    const token = await generateToken(body.username, body.tenantId);
    const passwordHash = hash(body.password);
    console.info(passwordHash);

    const newUser = await this.userRepository.create({
      username: body.username,
      password: passwordHash,
      tenantId: body.tenantId,
      firstName: body.firstName,
      lastName: body.lastName,
      accessToken: token
    });

    return {
      token
    };
  }

  public async signin({ body }: ISigninInput) {
    console.debug("UserController - signin:", JSON.stringify(body));

    const user = await this.userRepository.get(body);

    if (!user) {
      throw new BadRequestError([
        {
          location: "body",
          msg: "Wrong username or password",
          param: "body",
          value: ""
        }
      ]);
    }

    const token = await generateToken(user.username, user.tenantId);

    user.accessToken = token;

    this.userRepository.update(user);

    return {
      token
    };
  }

  public async signout({ headers }: ISignoutInput) {
    console.debug("UserController - signout:", JSON.stringify(headers));

    const token = headers.authorization.replace("Bearer ", "");

    if (!verifyToken(token)) {
      throw new UnauthorizedResponse();
    }

    const payload = await decodeToken(token);
    const user = await this.userRepository.getByUserName(payload.uid);

    if (!user) {
      throw new UnauthorizedResponse();
    }

    if (user.accessToken !== token) {
      throw new BadRequestError([
        {
          location: "body",
          msg: "Wrong jwt token",
          param: "body",
          value: ""
        }
      ]);
    }

    user.accessToken = null;

    this.userRepository.update(user);

    return {};
  }

  public async validateToken({ headers }: IValidateTokenInput) {
    console.debug("UserController - validateToken:", JSON.stringify(headers));
    const token = headers.authorization.replace("Bearer ", "");

    if (!verifyToken(token)) {
      throw new UnauthorizedResponse();
    }

    const payload = await decodeToken(token);
    const user = await this.userRepository.getByUserName(payload.uid);

    if (!user || user.accessToken !== token || payload.ext < Date.now()) {
      throw new BadRequestError([
        {
          location: "body",
          msg: "Wrong jwt token",
          param: "body",
          value: ""
        }
      ]);
    }

    return {
      active: true
    };
  }
}

export default new UserController();
