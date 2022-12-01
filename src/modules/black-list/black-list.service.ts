import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlackListService {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async addToken(token: string) {
    const queryComand = `
  INSERT INTO public."black_list"
  ("tokenValue")
	VALUES ($1);
    `;
    await this.dataSource.query(queryComand, [token]);
    return;
  }

  async getToken(token: string) {
    const queryComand = `
    SELECT * FROM public."black_list"
    WHERE "tokenValue"= $1
    `;
    const result = await this.dataSource.query(queryComand, [token]);
    return result;
  }
}
