/**
 * @http_example https://api.vworld.kr/req/address?
service=address&request=getcoord&version=2.0&crs=epsg:4326&address=%ED%9A%A8%EB%A0%B9%EB%A1%9C72%EA%B8%B8%2060
&refine=true&simple=false&format=xml&type=road&key=[KEY]

 * @param address 
 * @returns 
 */
export async function searchGeocode(
  address: string,
  { key, ...options }: Partial<ISearchGeocodeOptions> = {}
): Promise<ISearchGeocodeResponse> {
  if (!key) {
    throw new Error("key is required.");
  }
  return fetch(
    `https://api.vworld.kr/req/address?service=address&request=getCoord&key=${key}&${new URLSearchParams(
      {
        ...(options as Record<string, string>),
        address,
      }
    ).toString()}`
  ) as Promise<ISearchGeocodeResponse>;
}

export interface ISearchGeocodeOptions {
  version: string;
  crs: string;
  refine: boolean;
  simple: boolean;
  format: string;
  type: "PARCEL" | "ROAD";
  key: string;
}

/**
 *       {
        response: {
          service: {
            name: 'address',
            version: '2.0',
            operation: 'getCoord',
            time: '2(ms)'
          },
          status: 'ERROR',
          error: { level: '2', code: 'INVALID_KEY', text: '등록되지 않은 인증키입니다.' }
        }
      }
      *
      * if not found
      * 
       {
        response: {
          service: {
            name: 'address',
            version: '2.0',
            operation: 'getCoord',
            time: '43(ms)'
          },
          status: 'NOT_FOUND',
          record: { total: '0', current: '0' },
          page: { total: '1', current: '1', size: '10' }
        }
      }

      * if ok
      {
        response: {
          service: {
            name: 'address',
            version: '2.0',
            operation: 'getCoord',
            time: '31(ms)'
          },
          status: 'OK',
          input: { type: 'ROAD', address: '서울특별시 중구 세종대로 110' },
          refined: { text: '서울특별시 중구 세종대로 110 (태평로1가)', structure: [Object] },
          result: { crs: 'EPSG:4326', point: { x: '126.978346780', y: '37.566700969' } }
        }
      }
 */
export interface ISearchGeocodeResponseBody {
  response: {
    service: {
      name: string;
      version: string;
      operation: string;
      time: string;
    };
    status: "ERROR" | "OK" | "NOT_FOUND";
    error?: VWorldError;
    input?: {
      type: string;
      address: string;
    };
    refined?: {
      text: string;
      structure: any;
    };
    record?: {
      total: string;
      current: string;
    };
    page?: {
      total: string;
      current: string;
      size: string;
    };
    result?: {
      crs: "EPSG:4326" | string;
      point: {
        x: number;
        y: number;
      };
    };
  };
}

export interface VWorldError {
  total: string;
  current: string;
}

export interface VWorldError {
  level: string;
  code: string;
  text: string;
}

/**
 * Response {
        status: 200,
        statusText: '200',
        headers: Headers {
          date: 'Mon, 22 Sep 2025 08:35:04 GMT',
          upgrade: 'h2,h2c',
          connection: 'Upgrade',
          'set-cookie': 'WMONID=5Lc44PY0Y6-; Expires=Tue, 22-Sep-2026 17:35:04 GMT; Path=/, JSESSIONID=1E6C31F9D65BC8248E29935E639FE9C7.api_svr_11; Path=/; HttpOnly',
          'content-length': '665',
          p3p: "CP='CAO PSA CONi OTR OUR DEM ONL'",
          'content-type': 'application/json;charset=UTF-8'
        },
        body: ReadableStream { locked: false, state: 'readable', supportsBYOB: true },
        bodyUsed: false,
        ok: true,
        redirected: false,
        type: 'basic',
        url: 'https://api.vworld.kr/req/address?service=address&request=getCoord&key=825E57F1-94C6-398F-ACCE-F659BE3FD551&type=ROAD&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C+%EC%A4%91%EA%B5%AC+%EC%84%B8%EC%A2%85%EB%8C%80%EB%A1%9C+110'
      }
 */
export interface ISearchGeocodeResponse extends Response {
  status: number;
  statusText: string;
  headers: Headers;
  date: string;
  upgrade: string;
  connection: string;
  "set-cookie": string;
  "content-length": string;
  p3p: string;
  "content-type": string;
  body: ReadableStream<ISearchGeocodeResponseBody>;
  bodyUsed: boolean;
  ok: boolean;
  redirected: boolean;
  type: ResponseType;
  url: string;
  response: {
    service: {
      name: string;
      version: string;
      operation: string;
      time: string;
    };
  };

  json: () => Promise<ISearchGeocodeResponseBody>;
}

export type ResponseType =
  | "basic"
  | "cors"
  | "default"
  | "error"
  | "opaque"
  | "opaqueredirect";
