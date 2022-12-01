import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlackList } from '../../entities/black-list.entity';
import { BlackListService } from './black-list.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlackList])],
  providers: [BlackListService],
})
export class BlackListModule {}
