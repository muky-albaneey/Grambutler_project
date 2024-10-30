/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment_task } from './entities/comment.entity';
import { Task } from './entities/task.entity';
import { User } from '../user/entities/user.entity';
import { CreateCommentDto, CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Comment_task)
    private readonly commentRepository: Repository<Comment_task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const user = await this.userRepository.findOne({ where: { id: createTaskDto.userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      user,
    });

    const savedTask = await this.taskRepository.save(task);

    if (createTaskDto.comments) {
      const comments = createTaskDto.comments.map((commentDto: CreateCommentDto) => {
        const comment = this.commentRepository.create({
          content: commentDto.content,
          user,
          task: savedTask,
        });
        return comment;
      });
      await this.commentRepository.save(comments);
    }

    return savedTask;
  }

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment_task> {
    const { taskId, userId, content } = createCommentDto;

    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comment = this.commentRepository.create({
      content,
      task,
      user,
    });

    return this.commentRepository.save(comment);
  }

  async getCommentsByTask(taskId: string): Promise<Comment_task[]> {
    return this.commentRepository.find({
      where: { task: { id: taskId } },
      relations: ['user'],
    });
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    return this.taskRepository.find({ where: { user: { id: userId } } });
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['user'] });
  }

  async updateTask(id: string, updateTaskDto: Partial<UpdateTaskDto>): Promise<Task> {
    await this.taskRepository.update(id, updateTaskDto);
    const updatedTask = await this.taskRepository.findOne({ where: { id } });
    if (!updatedTask) {
      throw new NotFoundException('Task not found');
    }
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
