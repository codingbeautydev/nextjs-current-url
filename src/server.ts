import { IncomingMessage } from 'http';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server.js';

export function getUrl(options?: {
  req?: NextRequest | NextApiRequest | IncomingMessage;
}): URL | null {
  if (typeof window !== 'undefined') {
    return new URL(window.location.href);
  }

  const { req } = options || {};
  const scheme =
    process.env.VERCEL_ENV === 'production' ? 'https://' : 'http://';
  const vercelUrl = process.env.VERCEL_URL;
  const host = vercelUrl || (req?.headers as any)?.host;

  // if no relativeUrl, maybe we're in server env or user didn't pass req
  const relativeUrl = options?.req?.url;
  const headerUrl = (req?.headers as any)?.['x-url'];
  return relativeUrl
    ? new URL(
        headerUrl
          ? headerUrl
          : isValidUrl(relativeUrl)
          ? relativeUrl
          : scheme + host + relativeUrl
      )
    : null;
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

export function urlMiddleware() {
  return (req: Request) => {
    const reqHeaders = new Headers(req.headers);
    reqHeaders.set('x-url', req.url);

    return NextResponse.next({
      request: {
        // Apply new request headers
        headers: reqHeaders,
      },
    });
  };
}
