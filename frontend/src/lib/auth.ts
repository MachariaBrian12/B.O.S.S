import { api as API } from './api';

export async function login(email: string, password: string) {
  const res = await API.post('/auth/login', {
    email,
    password,
  });

  return res.data;
}

export async function register(email: string, password: string, name?: string) {
  const res = await API.post('/auth/register', {
    email,
    password,
    name,
  });

  return res.data;
}

export async function getMe() {
  const res = await API.get('/me');
  return res.data;
}
