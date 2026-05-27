import api from './axiosConfig';

// filterTip: 'ISTEKLE' | 'ISTICU_USKORO'
export const getIstekleClanarine = (filterTip: string, brojiDana?: number) =>
  api.get('/clanarine/istekle', { params: { filterTip, brojiDana } });