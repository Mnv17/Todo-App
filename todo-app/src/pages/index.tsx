import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Typography, Button, TextField, CircularProgress, Box, Container, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { api } from '@/utils/api';

export default function Home() {
  const [todo, setTodo] = useState('');
  const getTodos = api.todo.getTodos.useQuery();
  const submitTodo = api.todo.submitTodo.useMutation();
  const { data: session } = useSession();

  useEffect(() => {
    void getTodos.refetch();
  }, [getTodos, session]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!todo || todo.length < 5) {
      return alert('Todo must contain at least 5 characters');
    }

    await submitTodo.mutateAsync({ text: todo });

    void getTodos.refetch();

    setTodo('');
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
              name="todo"
              id="todo"
              label="Todo"
              variant="outlined"
              size="small"
              fullWidth
              onChange={(e) => setTodo(e.target.value)}
              value={todo}
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
                      <ListItemText primary={todo.text} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                          {/* Add delete icon or button functionality here */}
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
