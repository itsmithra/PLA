/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare module "next" {
  export interface Metadata {
    title?: string | { default: string; template: string };
    description?: string;
    icons?: any;
    keywords?: string[];
    authors?: any[];
    creator?: string;
    publisher?: string;
    robots?: any;
    openGraph?: any;
    twitter?: any;
    viewport?: any;
    [key: string]: any;
  }
}

declare module "next/link" {
  import * as React from "react";
  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string | { pathname?: string; query?: any };
    as?: string | { pathname?: string; query?: any };
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
  }
  const Link: React.ForwardRefExoticComponent<React.PropsWithoutRef<LinkProps> & React.RefAttributes<HTMLAnchorElement>>;
  export default Link;
}

declare module "next/navigation" {
  export function useRouter(): {
    push(href: string, options?: any): void;
    replace(href: string, options?: any): void;
    refresh(): void;
    back(): void;
    forward(): void;
    prefetch(href: string, options?: any): void;
  };
  export function usePathname(): string;
  export function useParams<T = Record<string, string | string[]>>(): T;
  export function useSearchParams(): URLSearchParams;
}

declare module "next/headers" {
  export function cookies(): Promise<{
    get(name: string): { name: string; value: string } | undefined;
    getAll(): { name: string; value: string }[];
    set(name: string, value: string, options?: any): void;
    delete(name: string): void;
    has(name: string): boolean;
  }>;
  export function headers(): Promise<Headers>;
}

declare module "next/server" {
  export class NextRequest {
    readonly nextUrl: URL;
    readonly cookies: {
      get(name: string): { name: string; value: string } | undefined;
      getAll(): { name: string; value: string }[];
      set(name: string, value: string): void;
      delete(name: string): void;
      has(name: string): boolean;
    };
    readonly headers: Headers;
    readonly ip?: string;
    readonly geo?: {
      city?: string;
      country?: string;
      region?: string;
      latitude?: string;
      longitude?: string;
    };
    json(): Promise<any>;
    text(): Promise<string>;
    formData(): Promise<FormData>;
    arrayBuffer(): Promise<ArrayBuffer>;
  }
  export class NextResponse {
    readonly cookies: {
      set(name: string, value: string, options?: any): void;
      get(name: string): { name: string; value: string } | undefined;
      getAll(): { name: string; value: string }[];
      delete(name: string): void;
    };
    static json(body: any, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, init?: number | ResponseInit): NextResponse;
    static rewrite(destination: string | URL, init?: ResponseInit): NextResponse;
    static next(init?: { request?: { headers?: Headers } }): NextResponse;
  }
}
