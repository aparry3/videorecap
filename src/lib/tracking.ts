import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export const getIpAddress = (headers: ReadonlyHeaders): string | undefined => {
    let ip: string | null | undefined = headers.get("x-real-ip");
    if (!ip) {
      const forwardedFor = headers.get("x-forwarded-for");
      if (Array.isArray(forwardedFor)) {
        ip = forwardedFor.at(0) as string | undefined;
      } else {
        ip = forwardedFor?.split(",").at(0);
      }
    }
    
    return ip === null ? undefined : ip;
}