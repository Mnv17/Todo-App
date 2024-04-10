import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  Typography,
  Button,
  TextField,
  CircularProgress,
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Avatar,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { api } from '@/utils/api';

interface Todo {
  id: string;
  title: string;
  done: boolean;
}

export default function Home() {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [editId, setEditId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTodoText, setEditTodoText] = useState('');
  const [todoError, setTodoError] = useState('');

  const ctx = api.useUtils();
  const { data: todosData, isLoading: todosLoading } = api.todo.getTodosByUser.useQuery(
    session?.user?.id ?? ''
  );

  const { mutate } = api.todo.createTodo.useMutation({
    onSuccess: () => {
      setTitle('');
      void ctx.todo.getTodosByUser.invalidate();
    },
  });

  const { mutate: setDoneMutate } = api.todo.setDone.useMutation({
    onSuccess: () => {
      void ctx.todo.getTodosByUser.invalidate();
    },
  });

  const { mutate: deleteMutate } = api.todo.deleteTodo.useMutation({
    onSuccess: () => {
      void ctx.todo.getTodosByUser.invalidate();
    },
  });

  const { mutate: editMutate } = api.todo.editTodo.useMutation({
    onSuccess: () => {
      setTitle('');
      setEditId('');
      void ctx.todo.getTodosByUser.invalidate();
      setIsEditing(false);
    },
  });

  const handleAddTodo = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!title.trim()) {
      setTodoError('Todo can\'t be empty');
      return;
    }

    mutate({
      userId: session?.user.id ?? '',
      title: title,
      done: false,
    });
  };

  const handleEditSubmit = () => {
    editMutate({
      id: editId, title: editTodoText,
    });
  };

  const handleEdit = (todo: Todo) => {
    setEditId(todo.id);
    setEditTodoText(todo.title);
    setIsEditing(true);
  };

  const handleCheckboxChange = (id: string, text: string, done: boolean) => {
    setDoneMutate({ id: id, done: !done });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Todo App
          </Typography>
          {session?.user && (
            <>
              {session.user.image && ( 
                <Avatar alt={session.user.name ?? ''} src={session.user.image} style={{ marginRight: '8px' }} />
              )}
              <Typography style={{ marginRight: "15px" }} variant="body1">
                Welcome, {session.user.name}
              </Typography>
              <Button variant="contained" onClick={() => signOut()} color="secondary">
                Sign Out
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" className="py-6 px-12" style={{ background: '#E0E0E0' }}>
        {session ? (
          <>
            <form onSubmit={handleAddTodo} style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <TextField
                type="text"
                name="text"
                id="todo"
                label="Todo"
                variant="outlined"
                size="small"
                fullWidth
                onChange={(e) => {
                  setTitle(e.target.value);
                  setTodoError('');
                }}
                value={title}
                style={{ marginBottom: '8px' }}
                error={!!todoError}
                helperText={todoError}
              />
              <Box mt={1}>
                <Button
                  style={{ backgroundColor: '#1976D2', width: '100%' }}
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Submit
                </Button>
              </Box>
            </form>
            <Box mt={2} display="flex" justifyContent="center">
              {todosLoading ? (
                <CircularProgress size={30} />
              ) : todosData ? (
                <List>
                  {todosData.map((todo: Todo) => (
                    <Box style={{ width: "500px" }} key={todo.id} boxShadow={3} p={2} mb={3} bgcolor="background.paper">
                      <ListItem>
                        <Checkbox
                          checked={todo.done ?? false}
                          onChange={() => handleCheckboxChange(todo.id, todo.title, todo.done ?? false)}
                        />
                        <ListItemText
                          primary={todo.title}
                          style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleEdit(todo)}
                          >
                            <EditIcon style={{ color: 'green' }} />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => deleteMutate(todo.id)}
                            style={{ marginLeft: '8px' }}
                          >
                            <DeleteIcon style={{ color: 'red' }} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="error">
                  Error fetching todos
                </Typography>
              )}
            </Box>
          </>
        ) : (
          <Button style={{ backgroundColor: '#1976D2' }} variant="contained" onClick={() => signIn()} color="primary">
            Sign In
          </Button>
        )}
      </Container>
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
          <Button onClick={handleEditSubmit} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
