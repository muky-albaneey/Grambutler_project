/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Param, Get, Patch, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateCommentDto, CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Task } from './entities/task.entity';
import { Comment_task } from './entities/comment.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.taskService.getAllTasks();
  }
  
  @Get('/count')
  async getTaskCount(): Promise<{ totalTasks: number }> {
    const totalTasks = await this.taskService.countTasks();
    return { totalTasks };
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

  //   // New endpoint to create a comment for a specific task
  @Post(':taskId/comments')
  async createComment(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() createCommentDto: CreateCommentDto
  ): Promise<Comment_task> {
    // Pass taskId along with the DTO data to the service
    return this.taskService.createComment({ ...createCommentDto, taskId });
  }

  // New endpoint to get all comments for a specific task
  @Get(':taskId/comments')
  async getCommentsByTask(
    @Param('taskId', ParseUUIDPipe) taskId: string
  ): Promise<Comment_task[]> {
    return this.taskService.getCommentsByTask(taskId);
  }
}
