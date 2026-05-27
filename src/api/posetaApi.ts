import api from './axiosConfig';

export const evidentirajUlazak = (clanId: number, data: any) =>
  api.post(`/clanovi/${clanId}/posete/ulazak`, data);

export const evidentirajIzlazak = (clanId: number) =>
  api.post(`/clanovi/${clanId}/posete/izlazak`);

export const getIstorijaPosteta = (clanId: number) =>
  api.get(`/clanovi/${clanId}/posete`);

export const getDetaljiPosete = (clanId: number, posetaId: number) =>
  api.get(`/clanovi/${clanId}/posete/${posetaId}`);