import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  async findOne(id: string): Promise<Todo> {
    return this.todoRepository.findOneBy({ id });
  }

  async create(todo: Partial<Todo>): Promise<Todo> {
    const newTodo = this.todoRepository.create(todo);
    return this.todoRepository.save(newTodo);
  }

  async update(id: string, todo: Partial<Todo>): Promise<Todo> {
    await this.todoRepository.update(id, todo);
    return this.findOne(id);
  }

  async remove(id: string): Promise<Todo> {
    const todo = await this.findOne(id);
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }
    await this.todoRepository.remove(todo);
    return todo;
  }
} 