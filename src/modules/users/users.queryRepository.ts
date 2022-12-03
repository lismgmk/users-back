import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserResponse } from './dto/users-interfaces.dto';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUser(dto: CreateUserDto & { hashPassword: string }) {
    const queryComand = `
INSERT INTO public."user"(
"firstName", "lastName", "email", "passwordHash")
VALUES ($1, $2, $3, $4);
    `;
    await this.dataSource.query(queryComand, [
      dto.firstName,
      dto.lastName,
      dto.email,
      dto.hashPassword,
    ]);
    return;
  }

  async addPdf(email: string, file: any) {
    const queryComand = `
   UPDATE "user"
SET 
"pdf" = $2 
WHERE "email" = $1
`;
    return this.dataSource.query(queryComand, [email, file]);
  }

  async getUserByEmailFirstName(
    dto: Omit<CreateUserDto, 'password' | 'lastName'>,
  ): Promise<User> {
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

  async getUserByEmail(email: string): Promise<User> {
    const queryComand = `
SELECT * FROM public."user"
WHERE ( "email" = $1 );
    `;
    const user = await this.dataSource.query(queryComand, [email]);
    return user[0];
  }

  async getUserById(id: string): Promise<User> {
    const queryComand = `
SELECT * FROM public."user"
WHERE id= $1
    `;
    const user = await this.dataSource.query(queryComand, [id]);
    return user[0];
  }

  async getUserByIdResponse(id: string): Promise<IUserResponse> {
    const queryComand = `
SELECT  id, "firstName", "lastName", email, image, pdf
FROM public."user"
WHERE id= $1
    `;
    const user = await this.dataSource.query(queryComand, [id]);
    return user[0];
  }

  async getUserByName(name: string): Promise<User> {
    const queryComand = `
SELECT * FROM public."user"
WHERE "firstName"= $1
    `;
    const user = await this.dataSource.query(queryComand, [name]);
    return user[0];
  }

  async getAllUsers(): Promise<IUserResponse[]> {
    const queryComand = `
SELECT id, "firstName", "lastName", email, image, pdf
 FROM public."user"
    `;
    return this.dataSource.query(queryComand);
  }

  async deleteUserById(id: string) {
    const queryComand = `
DELETE FROM "user"
WHERE id = $1;
    `;
    return this.dataSource.query(queryComand, [id]);
  }

  async changeUser(dto: UpdateUserDto & { id: string }) {
    const helperDto = {
      firstName: 'empty',
      lastName: 'empty',
      email: 'empty',
      ...dto,
    };
    const queryComand = `
   UPDATE "user"
SET 
"firstName" =  CASE
      WHEN $2 = 'empty'  THEN "user"."firstName" 
      ELSE $2
END,
"lastName" =  CASE
      WHEN $3 = 'empty'  THEN "user"."lastName" 
      ELSE  $3
END,
"email" =  CASE
      WHEN $4 = 'empty' THEN "user"."email"
      ELSE  $4
END
WHERE id = $1 `;
    return this.dataSource.query(queryComand, [
      helperDto.id,
      helperDto.firstName,
      helperDto.lastName,
      helperDto.email,
    ]);
  }

  async addImagePath(id: string, image: string) {
    const queryComand = `
   UPDATE "user"
SET 
"image" = $2 
WHERE id = $1;
`;
    return this.dataSource.query(queryComand, [id, image]);
  }
}
