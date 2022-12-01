import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async getAllUsers() {
    const queryComand = `
SELECT * FROM public."user"
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
    const queryComand = `
   UPDATE "user"
SET 
"firstName" =  CASE
      WHEN $2 != NULL  THEN $2
      ELSE "firstName"
END,
"lastName" =  CASE
      WHEN $3 != NULL  THEN $3
      ELSE "lastName"
END,
"email" =  CASE
      WHEN $4 != NULL  THEN $4
      ELSE "email"
END
WHERE id = $1;
 RETURNING *   `;
    return this.dataSource.query(queryComand, [
      dto.id,
      dto.firstName,
      dto.lastName,
      dto.email,
    ]);
  }
}
