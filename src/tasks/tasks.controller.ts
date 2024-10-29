// /* eslint-disable prettier/prettier */
// import { Controller, Post, Body, Param, Get, Patch, Put, Delete, ParseUUIDPipe } from '@nestjs/common';
// import { TaskService } from './tasks.service';
// import { CreateTaskDto } from './dto/task.dto';
// import { Task } from './entities/task.entity';
// import { UpdateTaskDto } from './dto/updat-task.dto';


// @Controller('tasks')
// export class TaskController {
//   constructor(private readonly taskService: TaskService) {}

//   @Post('task_create')
//   async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
//     return this.taskService.createTask(createTaskDto);
//   }

//   @Get('/:userId')
//   async getTasksByUser(@Param('userId') userId: string): Promise<Task[]> {
//     return this.taskService.getTasksByUser(userId);
//   }

//   @Patch(':id')
//   async updateTask(
//     @Param('id') id: string,
//     @Body() updateTaskDto: Partial<UpdateTaskDto>,
//   ): Promise<Task> {
//     return this.taskService.updateTask(id, updateTaskDto);
//   }

//   @Delete(':id')
//   async deleteTask(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
//     await this.taskService.deleteTask(id);
//   }
// }
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Param, Get, Patch, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateCommentDto, CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Task } from './entities/task.entity';
// import { UpdateTaskDto } from './dto/updat-task.dto';
import { Comment } from './entities/comment.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @Get('/:userId')
  async getTasksByUser(@Param('userId', ParseUUIDPipe) userId: string): Promise<Task[]> {
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

  // New endpoint to create a comment for a specific task
  @Post(':taskId/comments')
  async createComment(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() createCommentDto: CreateCommentDto
  ): Promise<Comment> {
    // Pass taskId along with the DTO data to the service
    return this.taskService.createComment({ ...createCommentDto, taskId });
  }

  // New endpoint to get all comments for a specific task
  @Get(':taskId/comments')
  async getCommentsByTask(
    @Param('taskId', ParseUUIDPipe) taskId: string
  ): Promise<Comment[]> {
    return this.taskService.getCommentsByTask(taskId);
  }
}
