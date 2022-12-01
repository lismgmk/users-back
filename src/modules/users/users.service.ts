import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { JwtPassService } from '../jwt-pass-service/jwt-pass.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    private jwtPassService: JwtPassService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const hashPassword = await this.jwtPassService.createPassBcrypt(
      dto.password,
    );
    const queryComand = `
INSERT INTO public."user"(
	"firstName", "lastName", "email", "passwordHash")
	VALUES ($1, $2, $3, $4);
    `;
    await this.dataSource.query(queryComand, [
      dto.firstName,
      dto.lastName,
      dto.email,
      hashPassword,
    ]);
    return;
  }

  async getUserByEmaiFirstName(
    dto: Omit<CreateUserDto, 'password' | 'lastName'>,
  ) {
    const queryComand = `
SELECT * FROM public."user"
WHERE ( "firstName" = $1 OR "email" = $2 );
    `;
    const user = await this.dataSource.query(queryComand, [
      dto.firstName,
      dto.email,
    ]);
    return user[0];
  }

  async getUserById(id: string) {
    const queryComand = `
SELECT * FROM public."user"
WHERE id= $1
    `;
    const user = await this.dataSource.query(queryComand, [id]);
    return user[0];
  }

  async getUserByName(name: string) {
    const queryComand = `
SELECT * FROM public."user"
WHERE "firstName"= $1
    `;
    const user = await this.dataSource.query(queryComand, [name]);
    return user[0];
  }
}
