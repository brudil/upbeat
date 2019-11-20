export function getAuthenticationToken() {
  return localStorage.hasOwnProperty('token')
    ? localStorage.getItem('token')
    : null;
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}
