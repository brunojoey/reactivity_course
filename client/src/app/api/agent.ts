// this file will host all of the api calls
import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity';
import { toast } from 'react-toastify';
import { history } from '../..'; // '../../' is leading to the index file
import { IUser, IUserFormValues } from '../models/user';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('jwt'); // check to see if we have a token
  if (token) config.headers.Authorization = `Bearer ${token}`; // attach token to autorization header and come out as Bearer token
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(undefined, error => {
  if (error.message === "Network Error" && !error.response) {
    toast.error('Network Error - Make Sure API is running.')
  }
  const {status, data, config} = error.response;
  if (status === 404) {
    history.push('/not-found');
  }
  if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
    history.push('/not-found');
  }
  if (status === 500) {
    toast.error('Server Error - Check the Terminal for More Information!')
  }
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response ? response.data : []


const sleep = (ms: number) => (response: AxiosResponse) => 
  new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) => axios.put(url,body).then(sleep(1000)).then(responseBody),
  delete: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody) 
};

const Activities = {
  list: (): Promise<IActivity[]> => requests.get('/activities'),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post('/activities', activity),
  update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete(`/activities/${id}`),
  attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
  unattend: (id:string) => requests.delete(`/activities/${id}/attend`)
};

const User = {
  current: (): Promise<IUser> => requests.get("/user"),
  login: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/login/`, user),
  register: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/register/`, user)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  Activities,
  User
};
