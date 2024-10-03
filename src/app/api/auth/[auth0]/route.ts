import { toQueryString } from '@/lib/utils';
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';

export const GET = handleAuth({
    login: handleLogin((req) => {
        const _params = (req as NextRequest).nextUrl.searchParams;
        console.log(req)
        console.log((req as NextRequest).nextUrl.searchParams)
        let state = _params.getAll('state') || undefined;
        const queryString = toQueryString({state: state})
        console.log('LOGIN', queryString)
        return {
            returnTo: `${_params.get('returnTo') ? String(_params.get('returnTo')) : '/account'}${queryString}`
        };
      })
    
});
