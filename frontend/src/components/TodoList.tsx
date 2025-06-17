"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Check, Loader2 } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/hooks/use-toast";

const TodoList = () => {
  const { tasks, isLoading, addTask, toggleTask, isAddingTask } = useTasks();
  const { toast, showToast } = useToast();
  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'normal'>('normal');

  // Get current date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const weekday = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const month = currentDate.toLocaleDateString('en-US', { month: 'short' });
  const year = currentDate.getFullYear();

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask({
        title: newTask,
        description: newTaskDescription || undefined,
        priority: newTaskPriority,
      }, {
        onSuccess: () => {
          showToast({
            title: "Task added",
            description: "Your task has been successfully added.",
          });
          setNewTask('');
          setNewTaskDescription('');
          setShowNewTaskForm(false);
          setNewTaskPriority('normal');
        },
        onError: () => {
          showToast({
            title: "Error",
            description: "Failed to add task. Please try again.",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    toggleTask({ id, completed: !completed }, {
      onError: () => {
        showToast({
          title: "Error",
          description: "Failed to update task. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const todoTasks = tasks.filter(task => !task.completed);
  const doneTasks = tasks.filter(task => task.completed);

  const getPriorityColor = (priority: 'high' | 'normal', completed: boolean) => {
    if (completed) return 'bg-green-500';
    return priority === 'high' ? 'bg-orange-500' : 'bg-blue-500';
  };

  const getPriorityLabel = (priority: 'high' | 'normal') => {
    return priority === 'high' ? 'HIGH PRIORITY' : 'NORMAL PRIORITY';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-8 px-4">
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            {/* Date Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-4xl font-bold text-gray-900">{day}</div>
                <div className="text-sm text-gray-600">{weekday}</div>
                <div className="text-sm text-gray-600">{month} {year}</div>
              </div>
              <Button 
                onClick={() => setShowNewTaskForm(!showNewTaskForm)}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-4 py-2 text-sm font-medium"
                disabled={isAddingTask}
              >
                {isAddingTask ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                NEW TASK
              </Button>
            </div>

            {/* New Task Form */}
            {showNewTaskForm && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <Input
                  placeholder="Task title..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="mb-3"
                />
                <Input
                  placeholder="Task description (optional)..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="mb-3"
                />
                <div className="flex gap-2 mb-3">
                  <Button
                    variant={newTaskPriority === 'high' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewTaskPriority('high')}
                    className={newTaskPriority === 'high' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                  >
                    High Priority
                  </Button>
                  <Button
                    variant={newTaskPriority === 'normal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewTaskPriority('normal')}
                    className={newTaskPriority === 'normal' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                  >
                    Normal Priority
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddTask} 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isAddingTask}
                  >
                    {isAddingTask ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Task'}
                  </Button>
                  <Button onClick={() => setShowNewTaskForm(false)} variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* TODO TASKS Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-center text-gray-900 mb-4 tracking-wide">TODO TASKS</h2>
              <div className="space-y-3">
                {todoTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`${getPriorityColor(task.priority, task.completed)} text-white rounded-lg p-4 cursor-pointer transition-all hover:shadow-md`}
                    onClick={() => handleToggleComplete(task.id, task.completed)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-xs font-semibold opacity-90 mb-1">
                          {getPriorityLabel(task.priority)}
                        </div>
                        <div className="font-semibold text-lg mb-1">{task.title}</div>
                        {task.description && (
                          <div className="text-sm opacity-90">{task.description}</div>
                        )}
                      </div>
                      <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center ml-4">
                        {/* Empty circle for incomplete tasks */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DONE TASKS Section */}
            {doneTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-center text-gray-900 mb-4 tracking-wide">DONE TASKS</h2>
                <div className="space-y-3">
                  {doneTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-green-500 text-white rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
                      onClick={() => handleToggleComplete(task.id, task.completed)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-xs font-semibold opacity-90 mb-1">DONE</div>
                          <div className="font-semibold text-lg mb-1">{task.title}</div>
                          {task.description && (
                            <div className="text-sm opacity-90">{task.description}</div>
                          )}
                        </div>
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center ml-4">
                          <Check className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {todoTasks.length === 0 && doneTasks.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">No tasks yet</div>
                <Button 
                  onClick={() => setShowNewTaskForm(true)}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Task
                </Button>
              </div>
            )}

            {/* Toast Notification */}
            {toast && (
              <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
                toast.variant === 'destructive' ? 'bg-red-500' : 'bg-green-500'
              } text-white`}>
                <div className="font-semibold">{toast.title}</div>
                <div className="text-sm opacity-90">{toast.description}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TodoList;