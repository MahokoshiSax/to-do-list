import { useState, useEffect } from 'react';
import { todoService } from '@/services/todo.service';
import { Todo } from '@/types/todo';

interface Task extends Todo {
  priority: 'high' | 'normal';
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const fetchTasks = async () => {
    try {
      const todos = await todoService.getTodos();
      setTasks(todos.map(todo => ({
        ...todo,
        priority: 'normal' as const
      })));
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (
    task: { title: string; description?: string; priority: 'high' | 'normal' },
    callbacks?: { onSuccess?: () => void; onError?: () => void }
  ) => {
    setIsAddingTask(true);
    try {
      const newTodo = await todoService.createTodo(task.title, task.description);
      setTasks(prev => [...prev, { ...newTodo, priority: task.priority }]);
      callbacks?.onSuccess?.();
    } catch (error) {
      console.error('Failed to add task:', error);
      callbacks?.onError?.();
    } finally {
      setIsAddingTask(false);
    }
  };

  const toggleTask = async (
    { id, completed }: { id: string; completed: boolean },
    callbacks?: { onSuccess?: () => void; onError?: () => void }
  ) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, { completed });
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, completed: updatedTodo.completed } : task
      ));
      callbacks?.onSuccess?.();
    } catch (error) {
      console.error('Failed to toggle task:', error);
      callbacks?.onError?.();
    }
  };

  return {
    tasks,
    isLoading,
    addTask,
    toggleTask,
    isAddingTask,
  };
}; 