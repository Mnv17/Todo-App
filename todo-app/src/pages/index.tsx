// index.tsx
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Typography, Button, TextField, CircularProgress, Box, Container, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox } from '@mui/material';
import { api } from '@/utils/api';

export default function Home() {
  const [todo, setTodo] = useState<{ text: string | null; id: number; completed: boolean | null; }>({ text: '', id: 0, completed: null });
  const getTodos = api.todo.getTodos.useQuery();
  const submitTodo = api.todo.submitTodo.useMutation();
  const updateTodo = api.todo.updateTodo.useMutation();
  const deleteTodo = api.todo.deleteTodo.useMutation();
  const { data: session } = useSession();

  useEffect(() => {
    void getTodos.refetch();
  }, [getTodos, session]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!todo.text || todo.text.length < 5) {
      return alert('Todo must contain at least 5 characters');
    }

    await submitTodo.mutateAsync({ text: todo.text });

    void getTodos.refetch();

    setTodo({ ...todo, text: '', id: 0, completed: null });
  };

  const handleCheckboxChange = async (id: number, completed: boolean | null | undefined) => {
    const updatedCompleted = completed ? false : true; // Toggle completed status

    await updateTodo.mutateAsync({ id, completed: updatedCompleted });

    void getTodos.refetch();
  };

  const handleDelete = async (id: number) => {
    await deleteTodo.mutateAsync({ id });

    void getTodos.refetch();
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
              name="text" // Change 'todo' to 'text'
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
            {getTodos.isLoading ? (
              <CircularProgress size={24} />
            ) : getTodos.isError ? (
              <Typography variant="body1" color="error">
                Error fetching todos: {getTodos.error?.message}
              </Typography>
            ) : (
              <List>
                {getTodos.data && Array.isArray(getTodos.data) ? (
                  getTodos.data.map((todo) => (
                    <ListItem key={todo.id}>
                      <Checkbox
                        checked={todo.completed ?? undefined}
                        onChange={() => handleCheckboxChange(todo.id, todo.completed)}
                      />
                      <ListItemText primary={todo.text ?? ''} /> {/* Handle null case */}
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(todo.id)}>
                          Delete
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
    </Container>
  );
}
