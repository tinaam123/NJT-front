import api from './axiosConfig'

export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password })

export const registrujKorisnika = (clanId: number, data: { username: string, password: string }) =>
  api.post(`/auth/registruj-korisnika/${clanId}`, data)