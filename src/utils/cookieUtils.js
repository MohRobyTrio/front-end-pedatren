// Atur cookie
export const setTokenCookie = (token) => {
  // const expires = new Date(Date.now() + expiresInMinutes * 60 * 1000).toUTCString();
  // document.cookie = `token=${token}; expires=${expires}; path=/`;
  const expiresInDays = 7;
  const expiredAt = Date.now() + expiresInDays * 24 * 60 * 60 * 1000; // 7 hari dalam ms
  document.cookie = `token=${token}; path=/`;
  document.cookie = `expiredAt=${expiredAt}; path=/`;
};

// Ambil token dari cookie
// export const getTokenCookie = () => {
//   const cookies = document.cookie.split(';');
//   for (const cookie of cookies) {
//     const [name, value] = cookie.trim().split('=');
//     if (name === 'token') return value;
//   }
//   return null;
// };

export const getCookie = (name) => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [k, v] = cookie.trim().split('=');
    if (k === name) return v;
  }
  return null;
};


// Hapus token
export const removeTokenCookie = () => {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  document.cookie = "expiredAt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
};
