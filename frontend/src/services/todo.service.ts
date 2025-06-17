import { gql } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';
import { Todo } from '@/types/todo';

const GET_TODOS = gql`
  query GetTodos {
    todo {
      id
      title
      description
      completed
      createdAt
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $description: String) {
    insert_todo_one(object: { title: $title, description: $description }) {
      id
      title
      description
      completed
      createdAt
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: uuid!, $set: todo_set_input!) {
    update_todo_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
      title
      description
      completed
      createdAt
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: uuid!) {
    delete_todo_by_pk(id: $id) {
      id
    }
  }
`;

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    try {
      console.log('Fetching todos...');
      const { data, error } = await apolloClient.query({
        query: GET_TODOS,
        fetchPolicy: 'network-only',
      });
      
      if (error) {
        console.error('GraphQL errors:', error);
        throw error;
      }
      
      if (!data || !data.todo) {
        console.error('No data returned from query');
        throw new Error('No data returned from query');
      }
      
      console.log('Todos fetched successfully:', data.todo);
      return data.todo;
    } catch (error) {
      console.error('Failed to get todo list:', error);
      throw error;
    }
  },

  async createTodo(title: string, description?: string): Promise<Todo> {
    try {
      console.log('Creating todo:', { title, description });
      const { data, errors } = await apolloClient.mutate({
        mutation: CREATE_TODO,
        variables: { title, description },
      });
      
      if (errors) {
        console.error('GraphQL errors:', errors);
        throw errors;
      }
      
      if (!data || !data.insert_todo_one) {
        console.error('No data returned from mutation');
        throw new Error('No data returned from mutation');
      }
      
      console.log('Todo created successfully:', data.insert_todo_one);
      return data.insert_todo_one;
    } catch (error) {
      console.error('Failed to create todo:', error);
      throw error;
    }
  },

  async updateTodo(id: string, data: Partial<Todo>): Promise<Todo> {
    try {
      console.log('Updating todo:', { id, data });
      const { data: result, errors } = await apolloClient.mutate({
        mutation: UPDATE_TODO,
        variables: {
          id,
          set: data,
        },
      });
      
      if (errors) {
        console.error('GraphQL errors:', errors);
        throw errors;
      }
      
      if (!result || !result.update_todo_by_pk) {
        console.error('No data returned from mutation');
        throw new Error('No data returned from mutation');
      }
      
      console.log('Todo updated successfully:', result.update_todo_by_pk);
      return result.update_todo_by_pk;
    } catch (error) {
      console.error('Failed to update todo:', error);
      throw error;
    }
  },

  async deleteTodo(id: string): Promise<void> {
    try {
      console.log('Deleting todo:', id);
      const { data, errors } = await apolloClient.mutate({
        mutation: DELETE_TODO,
        variables: { id },
      });
      
      if (errors) {
        console.error('GraphQL errors:', errors);
        throw errors;
      }
      
      if (!data || !data.delete_todo_by_pk) {
        console.error('No data returned from mutation');
        throw new Error('No data returned from mutation');
      }
      
      console.log('Todo deleted successfully:', data.delete_todo_by_pk);
    } catch (error) {
      console.error('Failed to delete todo:', error);
      throw error;
    }
  },
}; 