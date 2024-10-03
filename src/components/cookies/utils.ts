export const getCookie = (name: string): string | null => {
    let cookieArray = document.cookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookiePair = cookieArray[i].split('=');
      if (name === cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
    return null;
  }
  
export const setCookie = (name: string, value: string) => {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Set expiry for 1 year

    document.cookie = `${name}=${value};expires=${expiryDate.toUTCString()};path=/`
}
