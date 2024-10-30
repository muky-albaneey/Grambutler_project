/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Param, Get, Patch, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.taskService.getAllTasks();
  }
  
  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

 

  @Get('/:userId')
  async getTasksByUser(@Param('userId') userId: string): Promise<Task[]> {
    return this.taskService.getTasksByUser(userId);
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: Partial<UpdateTaskDto>
  ): Promise<Task> {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  async deleteTask(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.taskService.deleteTask(id);
  }
}
