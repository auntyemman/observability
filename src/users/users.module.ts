import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  controllers: [UsersController],
  providers: [UsersService, EventEmitter2],
})
export class UsersModule {}
