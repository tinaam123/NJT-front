import api from './axiosConfig';

export const kreirajTrenera = (data: any) =>
  api.post('/treneri', data);

export const getSveTrenere = () =>
  api.get('/treneri');

export const getTrener = (id: number) =>
  api.get(`/treneri/${id}`);

export const izmeniTrenera = (id: number, data: any) =>
  api.put(`/treneri/${id}`, data);

export const obrisiTrenera = (id: number) =>
  api.delete(`/treneri/${id}`);