// ============================================================================
// VWorld Geocoding API Function
// ============================================================================

import type {
  VWorldGetCoordinateOptions,
  VWorldGetCoordinateResponse,
} from "./types";

/**
 * @http_example https://api.vworld.kr/req/address?
service=address&request=getcoord&version=2.0&crs=epsg:4326&address=%ED%9A%A8%EB%A0%B9%EB%A1%9C72%EA%B8%B8%2060
&refine=true&simple=false&format=xml&type=road&key=[KEY]

 * @param address 
 * @returns 
 */
export async function getCoordinate(
  address: string,
  { key, ...options }: Partial<VWorldGetCoordinateOptions> = {}
): Promise<VWorldGetCoordinateResponse> {
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
  ) as Promise<VWorldGetCoordinateResponse>;
}
