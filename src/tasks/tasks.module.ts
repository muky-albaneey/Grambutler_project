import { Module } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { TaskController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { Task } from './entities/task.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Task]),
    ConfigModule, 
  ],
  exports: [TypeOrmModule],
  providers: [TaskService],
  controllers: [TaskController]
})
export class TasksModule {}
