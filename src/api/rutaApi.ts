import api from './axiosConfig';

export const kreirajRutu = (data: any) =>
  api.post('/rute', data);

export const getRuta = (id: number) =>
  api.get(`/rute/${id}`);

export const getSveRute = () =>
  api.get('/rute');

export const getAktivneRute = () =>
  api.get('/rute/aktivne/sve');

export const izmeniRutu = (id: number, data: any) =>
  api.put(`/rute/${id}`, data);

export const deaktivirajRutu = (id: number) =>
  api.patch(`/rute/${id}/deaktiviraj`);

export const obrisiRutu = (id: number) =>
  api.delete(`/rute/${id}`);