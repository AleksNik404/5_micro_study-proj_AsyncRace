import axios from 'axios';

import { URL_SERVER } from '@/helpers/types';

export const customAxios = axios.create({
  baseURL: URL_SERVER,
});
