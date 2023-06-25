/// <reference types="node" />
import { IncomingMessage } from 'http';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server.js';
export declare function getUrl(options?: {
    req?: NextRequest | NextApiRequest | IncomingMessage;
}): URL | null;
export declare function useUrl(): URL;
export declare function urlMiddleware(): (req: Request) => NextResponse<unknown>;
