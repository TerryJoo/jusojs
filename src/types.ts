/**
 * @reference https://business.juso.go.kr/addrlink/openApi/searchApi.do
 */

export interface ISearchAddressesOptions {
  countPerPage: number;
  currentPage: number;
  resultType: string;
  /**
   * @default process.env.JUSO_CONFIRM_KEY
   */
  confirmKey?: string;
}

export interface ISearchAddressesResultCommon {
  errorMessage: string;
  countPerPage: number;
  totalCount: number;
  errorCode: string;
  currentPage: number;
}

export interface IJuso {
  detBdNmList: string;
  engAddr: string;
  rn: string;
  emdNm: string;
  zipNo: string;
  roadAddrPart2: string;
  emdNo: string;
  sggNm: string;
  jibunAddr: string;
  siNm: string;
  roadAddrPart1: string;
  bdNm: string;
  admCd: string;
  udrtYn: string;
  lnbrMnnm: string;
  roadAddr: string;
  lnbrSlno: string;
  buldMnnm: string;
  bdKdcd: string;
  liNm: string;
  rnMgtSn: string;
  mtYn: string;
  bdMgtSn: string;
  buldSlno: string;
}

/**
 * @example {
 *   "results": {
 *     "common": {
 *       "errorMessage": "정상",
 *       "countPerPage": "10",
 *       "totalCount": "2",
 *       "errorCode": "0",
 *       "currentPage": "1"
 *     },
 *     "juso": [
 *       {
 *         "detBdNmList": "",
 *         "engAddr": "317 Dosan-daero, Gangnam-gu, Seoul",
 *         "rn": "도산대로",
 *         "emdNm": "신사동",
 *         "zipNo": "06021",
 *         "roadAddrPart2": " (신사동)",
 *         "emdNo": "02",
 *         "sggNm": "강남구",
 *         "jibunAddr": "서울특별시 강남구 신사동 651-24 호림아트센터 1빌딩",
 *         "siNm": "서울특별시",
 *         "roadAddrPart1": "서울특별시 강남구 도산대로 317",
 *         "bdNm": "호림아트센터 1빌딩",
 *         "admCd": "1168010700",
 *         "udrtYn": "0",
 *         "lnbrMnnm": "651",
 *         "roadAddr": "서울특별시 강남구 도산대로 317 (신사동)",
 *         "lnbrSlno": "24",
 *         "buldMnnm": "317",
 *         "bdKdcd": "0",
 *         "liNm": "",
 *         "rnMgtSn": "116802122001",
 *         "mtYn": "0",
 *         "bdMgtSn": "1168010700106510023000001",
 *         "buldSlno": "0"
 *       },
 *       {
 *         "detBdNmList": "",
 *         "engAddr": "6 Dosan-daero 45-gil, Gangnam-gu, Seoul",
 *         "rn": "도산대로45길",
 *         "emdNm": "신사동",
 *         "zipNo": "06021",
 *         "roadAddrPart2": " (신사동)",
 *         "emdNo": "01",
 *         "sggNm": "강남구",
 *         "jibunAddr": "서울특별시 강남구 신사동 651-16 호림아트센터 2빌딩",
 *         "siNm": "서울특별시",
 *         "roadAddrPart1": "서울특별시 강남구 도산대로45길 6",
 *         "bdNm": "호림아트센터 2빌딩",
 *         "admCd": "1168010700",
 *         "udrtYn": "0",
 *         "lnbrMnnm": "651",
 *         "roadAddr": "서울특별시 강남구 도산대로45길 6 (신사동)",
 *         "lnbrSlno": "16",
 *         "buldMnnm": "6",
 *         "bdKdcd": "0",
 *         "liNm": "",
 *         "rnMgtSn": "116804166277",
 *         "mtYn": "0",
 *         "bdMgtSn": "1168010700106510016000001",
 *         "buldSlno": "0"
 *       }
 *     ]
 *   }
 * }
 */
export interface ISearchAddressesResponse {
  results: {
    common: ISearchAddressesResultCommon;
    juso: IJuso[];
  };
}
