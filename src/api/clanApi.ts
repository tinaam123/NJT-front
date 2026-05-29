import api from './axiosConfig';

export const registrujClana = (data: any) =>
  api.post('/clanovi', data);

export const pretraziClanove = (kriterijum: string) =>
  api.get('/clanovi/pretraga', { params: { kriterijum } });

export const getClan = (id: number) =>
  api.get(`/clanovi/${id}`);

export const izmeniClana = (id: number, data: any) =>
  api.put(`/clanovi/${id}`, data);

export const getDostupniTreneri = (id: number) =>
  api.get(`/clanovi/${id}/dostupniTreneri`);

export const dodeliTrenera = (id: number, idTrenera: number) =>
  api.post(`/clanovi/${id}/dodelaTrenera`, { idTrenera });

export const ukloniTrenera = (id: number) =>
  api.delete(`/clanovi/${id}/trenera`);

export const getSviClanovi = () =>
  api.get('/clanovi')