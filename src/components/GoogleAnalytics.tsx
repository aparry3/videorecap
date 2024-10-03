"use client";
import Script from "next/script";
import { useCookieConsent } from "./cookies/CookieConsentContext";

const GoogleAnalytics = ({ ga_id }: { ga_id: string }) => {
    const [hasConsent] = useCookieConsent()
    return hasConsent ? (
        <>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js? 
          id=${ga_id}`}
        ></Script>
        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
    
              gtag('config', '${ga_id}');
            `,
          }}
        ></Script>
      </>
    ) : <></>
}
export default GoogleAnalytics;
