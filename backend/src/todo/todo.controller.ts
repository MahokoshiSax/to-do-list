import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';

@Controller('api/v1/todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Todo> {
    return this.todoService.findOne(id);
  }

  @Post()
  async create(@Body() todo: Partial<Todo>): Promise<Todo> {
    return this.todoService.create(todo);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() todo: Partial<Todo>): Promise<Todo> {
    return this.todoService.update(id, todo);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Todo> {
    return this.todoService.remove(id);
  }
} 