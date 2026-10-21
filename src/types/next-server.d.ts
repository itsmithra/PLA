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
