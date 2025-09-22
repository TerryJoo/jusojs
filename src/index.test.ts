import { config } from "dotenv";
import "dotenv/config";
config({ path: ".env.test.local" });

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { searchAddresses } from "./index";

// fetch 모킹을 위한 타입 정의
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

const confirmKey = process.env["JUSO_CONFIRM_KEY"];
if (!confirmKey) {
  throw new Error("JUSO_CONFIRM_KEY is not set");
}

describe("searchAddresses", () => {
  beforeEach(() => {
    // fetch 모킹 설정
    global.fetch = mockFetch;
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should search addresses with default options", async () => {
    // 실제 API 응답 형태 (문자열로 숫자 필드들이 옴)
    const mockApiResponse = {
      results: {
        common: {
          errorMessage: "정상",
          countPerPage: "10",
          totalCount: "2",
          errorCode: "0",
          currentPage: "1",
        },
        juso: [
          {
            detBdNmList: "",
            engAddr: "317 Dosan-daero, Gangnam-gu, Seoul",
            rn: "도산대로",
            emdNm: "신사동",
            zipNo: "06021",
            roadAddrPart2: " (신사동)",
            emdNo: "02",
            sggNm: "강남구",
            jibunAddr: "서울특별시 강남구 신사동 651-24 호림아트센터 1빌딩",
            siNm: "서울특별시",
            roadAddrPart1: "서울특별시 강남구 도산대로 317",
            bdNm: "호림아트센터 1빌딩",
            admCd: "1168010700",
            udrtYn: "0",
            lnbrMnnm: "651",
            roadAddr: "서울특별시 강남구 도산대로 317 (신사동)",
            lnbrSlno: "24",
            buldMnnm: "317",
            bdKdcd: "0",
            liNm: "",
            rnMgtSn: "116802122001",
            mtYn: "0",
            bdMgtSn: "1168010700106510023000001",
            buldSlno: "0",
          },
        ],
      },
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockApiResponse),
    } as Response);

    const result = await searchAddresses("도산대로", {
      confirmKey,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://business.juso.go.kr/addrlink/addrLinkApi.do",
      {
        method: "POST",
        body: expect.any(URLSearchParams),
      }
    );

    expect(result.results.common.currentPage).toBe(1);
    expect(result.results.common.countPerPage).toBe(10);
    expect(result.results.common.totalCount).toBe(2);
    expect(result.results.juso).toHaveLength(1);
    expect(result.results.juso[0]?.roadAddr).toBe(
      "서울특별시 강남구 도산대로 317 (신사동)"
    );
  });

  it("should search addresses with custom options", async () => {
    const mockApiResponse = {
      results: {
        common: {
          errorMessage: "정상",
          countPerPage: "5",
          totalCount: "1",
          errorCode: "0",
          currentPage: "2",
        },
        juso: [],
      },
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockApiResponse),
    } as Response);

    const result = await searchAddresses("강남구", {
      countPerPage: 5,
      currentPage: 2,
      confirmKey,
    });

    expect(result.results.common.currentPage).toBe(2);
    expect(result.results.common.countPerPage).toBe(5);
    expect(result.results.common.totalCount).toBe(1);
  });

  it("should handle API error response", async () => {
    const mockErrorResponse = {
      results: {
        common: {
          errorMessage: "인증키가 유효하지 않습니다.",
          countPerPage: "0",
          totalCount: "0",
          errorCode: "E0001",
          currentPage: "0",
        },
        juso: [],
      },
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockErrorResponse),
    } as Response);

    const result = await searchAddresses("테스트", {
      confirmKey,
    });

    expect(result.results.common.errorCode).toBe("E0001");
    expect(result.results.common.errorMessage).toBe(
      "인증키가 유효하지 않습니다."
    );
    expect(result.results.juso).toHaveLength(0);
  });

  it("should convert string numbers to actual numbers in common object", async () => {
    const mockApiResponse = {
      results: {
        common: {
          errorMessage: "정상",
          countPerPage: "15",
          totalCount: "100",
          errorCode: "0",
          currentPage: "3",
        },
        juso: [],
      },
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockApiResponse),
    } as Response);

    const result = await searchAddresses("테스트", {
      confirmKey,
    });

    expect(typeof result.results.common.currentPage).toBe("number");
    expect(typeof result.results.common.countPerPage).toBe("number");
    expect(typeof result.results.common.totalCount).toBe("number");
    expect(result.results.common.currentPage).toBe(3);
    expect(result.results.common.countPerPage).toBe(15);
    expect(result.results.common.totalCount).toBe(100);
  });

  it("should handle empty keyword", async () => {
    const mockApiResponse = {
      results: {
        common: {
          errorMessage: "검색어를 입력해주세요.",
          countPerPage: "0",
          totalCount: "0",
          errorCode: "E0002",
          currentPage: "0",
        },
        juso: [],
      },
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockApiResponse),
    } as Response);

    const result = await searchAddresses("", {
      confirmKey,
    });

    expect(result.results.common.errorCode).toBe("E0002");
    expect(result.results.common.errorMessage).toBe("검색어를 입력해주세요.");
  });

  it("should handle network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(
      searchAddresses("테스트", {
        confirmKey,
      })
    ).rejects.toThrow("Network error");
  });

  it("should handle malformed JSON response", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.reject(new Error("Invalid JSON")),
    } as Response);

    await expect(
      searchAddresses("테스트", {
        confirmKey,
      })
    ).rejects.toThrow("Invalid JSON");
  });

  it("should use correct URL parameters", async () => {
    const mockApiResponse = {
      results: {
        common: {
          errorMessage: "정상",
          countPerPage: "10",
          totalCount: "0",
          errorCode: "0",
          currentPage: "1",
        },
        juso: [],
      },
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockApiResponse),
    } as Response);

    await searchAddresses("강남구", {
      countPerPage: 20,
      currentPage: 1,
      resultType: "xml",

      confirmKey,
    });

    const fetchCall = mockFetch.mock.calls[0];
    if (fetchCall && fetchCall[1]) {
      const body = fetchCall[1].body as URLSearchParams;

      expect(body.get("keyword")).toBe("강남구");
      expect(body.get("countPerPage")).toBe("20");
      expect(body.get("currentPage")).toBe("1");
      expect(body.get("resultType")).toBe("xml");
      expect(body.get("confmKey")).toBe(confirmKey);
    }
  });

  it("should handle multiple address results", async () => {
    const mockApiResponse = {
      results: {
        common: {
          errorMessage: "정상",
          countPerPage: "10",
          totalCount: "3",
          errorCode: "0",
          currentPage: "1",
        },
        juso: [
          {
            detBdNmList: "",
            engAddr: "1 Test Street, Seoul",
            rn: "테스트로",
            emdNm: "테스트동",
            zipNo: "12345",
            roadAddrPart2: " (테스트동)",
            emdNo: "01",
            sggNm: "테스트구",
            jibunAddr: "서울특별시 테스트구 테스트동 1-1",
            siNm: "서울특별시",
            roadAddrPart1: "서울특별시 테스트구 테스트로 1",
            bdNm: "테스트빌딩",
            admCd: "1234567890",
            udrtYn: "0",
            lnbrMnnm: "1",
            roadAddr: "서울특별시 테스트구 테스트로 1 (테스트동)",
            lnbrSlno: "1",
            buldMnnm: "1",
            bdKdcd: "0",
            liNm: "",
            rnMgtSn: "123456789012",
            mtYn: "0",
            bdMgtSn: "1234567890123456789012345",
            buldSlno: "0",
          },
          {
            detBdNmList: "",
            engAddr: "2 Test Street, Seoul",
            rn: "테스트로",
            emdNm: "테스트동",
            zipNo: "12345",
            roadAddrPart2: " (테스트동)",
            emdNo: "02",
            sggNm: "테스트구",
            jibunAddr: "서울특별시 테스트구 테스트동 2-2",
            siNm: "서울특별시",
            roadAddrPart1: "서울특별시 테스트구 테스트로 2",
            bdNm: "테스트빌딩2",
            admCd: "1234567890",
            udrtYn: "0",
            lnbrMnnm: "2",
            roadAddr: "서울특별시 테스트구 테스트로 2 (테스트동)",
            lnbrSlno: "2",
            buldMnnm: "2",
            bdKdcd: "0",
            liNm: "",
            rnMgtSn: "123456789012",
            mtYn: "0",
            bdMgtSn: "1234567890123456789012346",
            buldSlno: "0",
          },
        ],
      },
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockApiResponse),
    } as Response);

    const result = await searchAddresses("테스트", {
      confirmKey,
    });

    expect(result.results.juso).toHaveLength(2);
    expect(result.results.juso[0]?.roadAddr).toBe(
      "서울특별시 테스트구 테스트로 1 (테스트동)"
    );
    expect(result.results.juso[1]?.roadAddr).toBe(
      "서울특별시 테스트구 테스트로 2 (테스트동)"
    );
  });
});
