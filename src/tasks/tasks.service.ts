import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateTaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/updat-task.dto';


@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    // Find the user associated with the task
    const user = await this.userRepository.findOne({ where: { id: createTaskDto.userId } });

    if (!user) {
      throw new Error('User not found');
    }

    // Create a new task
    const task = this.taskRepository.create({
      ...createTaskDto,
      user, // Associate the user with the task
    });

    // Save the task to the database
    return this.taskRepository.save(task);
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { user: { id: userId } },
      relations: ['user'], // Include the user relation if needed
    });
  }

  async updateTask(id, updateTaskDto: Partial<UpdateTaskDto>): Promise<Task> {
    // Find the task by its ID
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Apply partial updates
    Object.assign(task, updateTaskDto);

    // Save the updated task
    return this.taskRepository.save(task);
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  
}
