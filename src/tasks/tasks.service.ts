/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
// import { Task } from '../task/entities/task.entity';
import { User } from '../user/entities/user.entity';
import { Task } from './entities/task.entity';
import { CreateCommentDto, CreateTaskDto, UpdateTaskDto} from './dto/task.dto';
// import { CreateCommentDto } from './dto/create-comment.dto';



// @Injectable()
// export class CommentService {
//   constructor(
//     @InjectRepository(Comment)
//     private readonly commentRepository: Repository<Comment>,

//     @InjectRepository(Task)
//     private readonly taskRepository: Repository<Task>,

//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}


//   async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
//     const user = await this.userRepository.findOne({ where: { id: createTaskDto.userId } });

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     // Create the new task
//     const task = this.taskRepository.create({
//       ...createTaskDto,
//       user, // Associate the user with the task
//     });

//     // Save the task to the database
//     const savedTask = await this.taskRepository.save(task);

//     // If comments are provided, save them as well
//     if (createTaskDto.comments) {
//       const comments = createTaskDto.comments.map(commentDto => {
//         const comment = this.commentRepository.create({
//           content: commentDto.content,
//           user: user, // Associate the user with the comment
//           task: savedTask, // Associate the comment with the created task
//         });
//         return comment;
//       });

//       // Save all comments
//       await this.commentRepository.save(comments);
//     }

//     return savedTask;
//   }

//   async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
//     const { taskId, userId, content } = createCommentDto;

//     // Find the task by ID
//     const task = await this.taskRepository.findOne({ where: { id: taskId } });
//     if (!task) {
//       throw new NotFoundException('Task not found');
//     }

//     // Check if the user exists
//     const user = await this.userRepository.findOne({ where: { id: userId } });
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     // Create and save the comment
//     const comment = this.commentRepository.create({
//       content,
//       task,
//       user,
//     });

//     return this.commentRepository.save(comment);
//   }

//   async getCommentsByTask(taskId: string): Promise<Comment[]> {
//     return this.commentRepository.find({
//       where: { task: { id: taskId } },
//       relations: ['user'],
//     });
//   }
// }

/* eslint-disable prettier/prettier */


@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const user = await this.userRepository.findOne({ where: { id: createTaskDto.userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create the new task
    const task = this.taskRepository.create({
      ...createTaskDto,
      user, // Associate the user with the task
    });

    // Save the task to the database
    const savedTask = await this.taskRepository.save(task);

    // If comments are provided, save them as well
    if (createTaskDto.comments) {
      const comments = createTaskDto.comments.map((commentDto: CreateCommentDto) => {
        const comment = this.commentRepository.create({
          content: commentDto.content,
          user, // Associate the user with the comment
          task: savedTask, // Associate the comment with the created task
        });
        return comment;
      });

      // Save all comments
      await this.commentRepository.save(comments);
    }

    return savedTask;
  }

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { taskId, userId, content } = createCommentDto;

    // Find the task by ID
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if the user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create and save the comment
    const comment = this.commentRepository.create({
      content,
      task,
      user,
    });

    return this.commentRepository.save(comment);
  }

  async getCommentsByTask(taskId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { task: { id: taskId } },
      relations: ['user'],
    });
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    return this.taskRepository.find({ where: { user: { id: userId } } });
  }

  async updateTask(id: string, updateTaskDto: Partial<CreateTaskDto>): Promise<Task> {
    await this.taskRepository.update(id, updateTaskDto);
    return this.taskRepository.findOne({ where: { id } });
  }

  async deleteTask(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
