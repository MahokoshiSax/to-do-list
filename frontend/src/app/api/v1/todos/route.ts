import { NextRequest, NextResponse } from 'next/server';
import { fetchInternalApi } from '@/utils/internal/internal-api';
import axios from 'axios';
import { Todo } from '@/types/todo';

const API_URL = "http://localhost:3001";

export async function GET(req: NextRequest) {
  try {
    const urlPath = new URL(req.url).pathname;
    const queryParams = new URL(req.url).searchParams;
    const url = `${API_URL}${urlPath}?${queryParams}`;
    const response = await axios.get(url);
    
    // Ensure we're returning all fields including description
    const todos = response.data.map((todo: Todo) => ({
      id: todo.id,
      title: todo.title,
      description: todo.description || '',
      completed: todo.completed,
      createdAt: todo.createdAt
    }));
    
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    return fetchInternalApi(req);
  } catch (error) {
    console.error('Failed to create todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
