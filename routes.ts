import { Router } from 'https://deno.land/x/oak/mod.ts';
import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from './controllers/users.ts';

const router = new Router();

router
  .post('/api/users', addUser)
  .get('/api/users', getUsers)
  .get('/api/users/:id', getUser)
  .put('/api/users/:id', updateUser)
  .delete('/api/users/:id', deleteUser);

export default router;
