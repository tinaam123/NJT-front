import api from './axiosConfig';

export const dodajPokusaj = (clanId: number, data: any) =>
  api.post(`/clanovi/${clanId}/posete/aktivna/pokusaji`, data);

export const getNapredak = (clanId: number, params?: {
  kategorija?: string;
  datumOd?: string;
  datumDo?: string;
  savladana?: boolean;
}) => api.get(`/clanovi/${clanId}/pokusaji`, { params });