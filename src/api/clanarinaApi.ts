import api from './axiosConfig';

export const dodajClanarinu = (clanId: number, data: any) =>
  api.post(`/clanovi/${clanId}/clanarine`, data);

export const getStatusClanarine = (clanId: number) =>
  api.get(`/clanovi/${clanId}/clanarine/status`);