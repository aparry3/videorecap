"use client"
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { getCookie, setCookie } from './utils';

const CookieConsentContext = createContext<[boolean, () => void]>([false, () => {}]);

const CONSENT_COOKIE_NAME = "cookieConsent"

export const CookieConsentProvider = ({ children }: {children: ReactNode}) => {
  const [consent, setConsent] = useState(false);

  // Utility functions to get and set cookie
  const giveConsent = () => {
    setCookie(CONSENT_COOKIE_NAME, "true")
    setConsent(true);
};


  useEffect(() => {
    const consentGiven = getCookie(CONSENT_COOKIE_NAME);
    setConsent(!!consentGiven);
  }, []);


  return (
    <CookieConsentContext.Provider value={[consent, giveConsent]}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => useContext(CookieConsentContext)


export default CookieConsentContext;
