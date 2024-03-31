import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Typography, Button, TextField, CircularProgress, Box, Container, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'; // Import icons
import { api } from '@/utils/api';

export default function Home() {
  const [todo, setTodo] = useState<{ text: string | null; id: string; completed: boolean | null; }>({ text: '', id: '0', completed: null });
  const [editTodoText, setEditTodoText] = useState<string>('');
  const [editTodoId, setEditTodoId] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const getTodosQuery = api.todo.getTodos.useQuery();
  const submitTodoMutation = api.todo.submitTodo.useMutation();
  const updateTodoMutation = api.todo.updateTodo.useMutation();
  const deleteTodoMutation = api.todo.deleteTodo.useMutation();
  const { data: session } = useSession();

  useEffect(() => {
    void getTodosQuery.refetch();
  }, [getTodosQuery, session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!todo.text || todo.text.length < 5) {
      return alert('Todo must contain at least 5 characters');
    }

    await submitTodoMutation.mutateAsync({ text: todo.text });

    void getTodosQuery.refetch();

    setTodo({ ...todo, text: '', id: '0', completed: null });
  };

  const handleDelete = async (id: string) => {
    await deleteTodoMutation.mutateAsync({ id });

    void getTodosQuery.refetch();
  };

  const handleCheckboxChange = async (id: string, text: string, completed: boolean) => {
    const updatedCompleted = !completed;

    await updateTodoMutation.mutateAsync({ id, text, completed: updatedCompleted }, {
      onSuccess: () => {
        void getTodosQuery.refetch(); // Refetch todos after successful update
      },
      onError: (error) => {
        console.error('Error updating todo:', error);
        // Handle error if update fails
      },
    });
  };

  const handleEdit = (id: string, text: string) => {
    setEditTodoId(id);
    setEditTodoText(text);
    setIsEditing(true);
  };

  const handleEditSubmit = async () => {
    if (!editTodoText || editTodoText.length < 5) {
      return alert('Todo must contain at least 5 characters');
    }

    await updateTodoMutation.mutateAsync({ id: editTodoId, text: editTodoText, completed: todo.completed ?? false }, {
      onSuccess: () => {
        void getTodosQuery.refetch(); // Refetch todos after successful update
        setEditTodoId('');
        setEditTodoText('');
        setIsEditing(false);
      },
      onError: (error) => {
        console.error('Error updating todo:', error);
        // Handle error if update fails
      },
    });
  };

  return (
    <Container maxWidth={false} className="py-6 px-12" style={{ background: "#E0E0E0" }}>
      <Typography variant="h4" gutterBottom>
        {session?.user ? `Welcome, ${session.user.name}` : 'Please sign in'}
      </Typography>
      {session ? (
        <>
          <Button variant="contained" onClick={() => signOut()} color="secondary" style={{ color: "white", background: "red" }}>
            Sign Out
          </Button>
          <form onSubmit={handleSubmit} style={{ marginTop: '16px', display: "flex", gap: "8px" }}>
            <TextField
              type="text"
              name="text"
              id="todo"
              label="Todo"
              variant="outlined"
              size="small"
              fullWidth
              onChange={(e) => setTodo({ ...todo, text: e.target.value })}
              value={todo.text}
              style={{ marginBottom: '8px' }}
            />
            <Button type="submit" variant="contained" color="primary" size="small" style={{ color: "white", background: "blue" }}>
              Submit
            </Button>
          </form>
          <Box mt={2}>
            {getTodosQuery.isLoading ? (
              <CircularProgress size={24} />
            ) : getTodosQuery.isError ? (
              <Typography variant="body1" color="error">
                Error fetching todos: {getTodosQuery.error?.message}
              </Typography>
            ) : (
              <List>
                {getTodosQuery.data && Array.isArray(getTodosQuery.data) ? (
                  getTodosQuery.data.map((todo) => (
                    <ListItem key={todo.id.toString()}>
                      <Checkbox
                        checked={todo.completed ?? false}
                        onChange={() => handleCheckboxChange(todo.id.toString(), todo.text ?? '', todo.completed ?? false)}
                      />
                      <ListItemText
                        primary={todo.text ?? ''}
                        secondary={todo.completed ? 'Completed' : 'Incomplete'}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(todo.id.toString(), todo.text ?? '')}>
                          <EditIcon style={{ color: 'green' }} />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(todo.id.toString())} style={{ marginLeft: '8px' }}>
                          <DeleteIcon style={{ color: 'red' }} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body1">No todos found.</Typography>
                )}
              </List>
            )}
          </Box>
        </>
      ) : (
        <Button variant="contained" onClick={() => signIn()} color="primary" style={{ color: "white", background: "purple" }}>
          Sign In
        </Button>
      )}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <TextField
            type="text"
            name="editTodo"
            label="Edit Todo"
            variant="outlined"
            fullWidth
            value={editTodoText}
            onChange={(e) => setEditTodoText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
