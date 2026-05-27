import api from './axiosConfig';

export const getIzvestajPosecenosti = (start: string, end: string) =>
  api.get('/izvestaji/posecenost', { params: { start, end } });

export const downloadIzvestajCsv = (start: string, end: string) =>
  api.get('/izvestaji/posecenost/csv', {
    params: { start, end },
    responseType: 'blob',
  });