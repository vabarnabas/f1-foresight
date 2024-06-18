export function pathBuilder(path: string, params?: Record<string, unknown>) {
  let localPath: string = path;

  if (!params) return localPath;

  Object.keys(params).forEach((key) => {
    const param = String(params[key]);

    if (typeof param === "string" && localPath.includes(`:${key}`)) {
      localPath = localPath.replace(`:${key}`, param);
    }
  });

  return localPath;
}

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestParams {
  params?: Record<string, unknown>;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  token?: string;
}

export interface RequestOptions {
  baseUrl: string;
  path: string;
  token?: string;
  body?: string;
  headers?: Record<string, string>;
}

export const request = async (
  method: RequestMethod,
  { baseUrl, path, body, token, headers }: RequestOptions
) => {
  const config: RequestInit = {
    method,
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
    }),
    ...(body && { body }),
  };

  try {
    const response = await fetch(
      `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`,
      config
    );

    if (!response.ok) {
      const errorMessage = `Request failed with status: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const { status, statusText, headers, url } = response;
    return { data, status, statusText, headers, url };
  } catch (e) {
    console.error(`Something went wrong - ${e}.`);
    throw new Error(`Something went wrong - ${e}.`);
  }
};

export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  private base(method: RequestMethod, path: string, params?: RequestParams) {
    return request(method, {
      baseUrl: this.baseUrl,
      path: pathBuilder(path, params?.params),
      body: params?.body ? JSON.stringify(params.body) : undefined,
      headers: params?.headers,
      token: params?.token,
    }).catch((e) => {
      throw new Error("Something went wrong. " + e);
    });
  }

  get(path: string, params?: RequestParams) {
    return this.base("GET", path, params);
  }

  post(path: string, params?: RequestParams) {
    return this.base("POST", path, params);
  }

  put(path: string, params?: RequestParams) {
    return this.base("PUT", path, params);
  }

  delete(path: string, params?: RequestParams) {
    return this.base("DELETE", path, params);
  }
}
