import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FIELD_EXIST_VALIDATION_ERROR } from '../../consts/ad-validation-const';
import { JwtPassService } from '../jwt-pass-service/jwt-pass.service';
import { CompileService } from './compile.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersQueryRepository } from './users.queryRepository';
@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    private jwtPassService: JwtPassService,
    private usersQueryRepository: UsersQueryRepository,
    private compileService: CompileService,
  ) {}

  async getAllUsers() {
    return this.usersQueryRepository.getAllUsers();
  }

  async getUserById(id: string) {
    await this.checkExistUserById(id);
    return this.usersQueryRepository.getUserByIdResponse(id);
  }

  async createUser(dto: CreateUserDto) {
    await this.checkExistUserByNameEmail(dto);
    const hashPassword = await this.jwtPassService.createPassBcrypt(
      dto.password,
    );
    return this.usersQueryRepository.createUser({ ...dto, hashPassword });
  }

  async changeUser(dto: UpdateUserDto & { id: string }) {
    await this.checkExistUserById(dto.id);
    return this.usersQueryRepository.changeUser(dto);
  }

  async checkExistUserById(id: string) {
    const user = await this.usersQueryRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException();
    }
  }

  async checkExistUserByNameEmail(
    dto: Omit<CreateUserDto, 'lastName' | 'password'>,
  ) {
    const checkExistUser =
      await this.usersQueryRepository.getUserByEmailFirstName({
        firstName: dto.firstName,
        email: dto.firstName,
      });

    if (checkExistUser) {
      throw new BadRequestException({
        message: FIELD_EXIST_VALIDATION_ERROR,
      });
    }
  }

  async checkExistUserByEmail(email: string) {
    const checkExistUser = await this.usersQueryRepository.getUserByEmail(
      email,
    );

    if (!checkExistUser) {
      throw new NotFoundException();
    }
    return checkExistUser;
  }

  async deleteUserById(id: string) {
    await this.checkExistUserById(id);
    return this.usersQueryRepository.deleteUserById(id);
  }

  async saveFile(id: string, file: Express.Multer.File) {
    await this.checkExistUserById(id);
    return this.compileService.saveFile(id, file);
  }

  async addPdf(email: string) {
    const user = await this.checkExistUserByEmail(email);
    return this.compileService.addPdf(user);
  }
}
