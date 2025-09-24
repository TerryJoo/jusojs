// ============================================================================
// VWorld Geocoding API Types
// ============================================================================

export interface VWorldGetCoordinateOptions {
  version: string;
  crs: string;
  refine: boolean;
  simple: boolean;
  format: string;
  type: "PARCEL" | "ROAD";
  key: string;
}

export interface VWorldError {
  level: string;
  code: string;
  text: string;
}

export interface AddressStructure {
  level0: string;
  level1: string;
  level2: string;
  level3: string;
  level4L: string;
  level4LC: string;
  level4A: string;
  level4AC: string;
  level5: string;
  detail: string;
}

/**
 * VWorld API response body structure
 */
export interface VWorldGetCoordinateResponseBody {
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
      /**
       * @example {
        level0: '대한민국',
        level1: '서울특별시',
        level2: '중구',
        level3: '태평로1가',
        level4L: '세종대로',
        level4LC: '',
        level4A: '명동',
        level4AC: '1114055000',
        level5: '110',
        detail: '서울특별시 청사 신관'
      }
       */
      structure: AddressStructure;
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

/**
 * Extended Response interface for VWorld geocoding API
 */
export interface VWorldGetCoordinateResponse extends Response {
  json: () => Promise<VWorldGetCoordinateResponseBody>;
}
