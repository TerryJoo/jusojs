import { config } from "dotenv";
import { searchGeocode } from "./search-geocode";
config({ path: ".env.test.local" });

const key = process.env["VWORLD_KEY"];
if (!key) {
  throw new Error("VWORLD_KEY is not set");
}

describe("searchGeocode", () => {
  it("should return latitude and longitude for a valid address", async () => {
    await searchGeocode("서울특별시 중구 세종대로 110", {
      key,
      type: "ROAD",
    }).then((result) => {
      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
      expect(result.statusText).toBe("200");
      expect(result.headers.get("content-type")).toBe(
        "application/json;charset=UTF-8"
      );
      expect(result.body).toBeDefined();
    });
  });

  it("should return an error for an invalid address", async () => {
    await searchGeocode("Invalid Address", {
      key,
      type: "ROAD",
    }).then(async (result) => {
      expect(result.ok).toBe(true);
      const body = await result.json();
      // common
      expect(body.response.service.name).toBe("address");
      expect(body.response.service.version).toBe("2.0");
      expect(body.response.service.operation).toBe("getCoord");
      expect(body.response.service.time).toBeDefined();
      expect(body.response.service.time).toMatch(/^\d+\(ms\)$/);

      // status
      expect(body.response.status).toBe("NOT_FOUND");

      // error
      expect(body.response.error).toBeUndefined();

      // body
      expect(body.response.record).toBeDefined();
      expect(body.response.page).toBeDefined();
      expect(body.response.record!.total).toBe("0");
      expect(body.response.record!.current).toBe("0");
      expect(body.response.page!.total).toBe("1");
      expect(body.response.page!.current).toBe("1");
      expect(body.response.page!.size).toBe("10");
    });
  });

  it("should return an error for an invalid key", async () => {
    await searchGeocode("서울특별시 중구 세종대로 110", {
      key: "Invalid Key",
      type: "ROAD",
    }).then(async (result) => {
      expect(result.ok).toBe(true);
      const body = await result.json();
      expect(body.response.service.name).toBe("address");
      expect(body.response.service.version).toBe("2.0");
      expect(body.response.service.operation).toBe("getCoord");
      expect(body.response.service.time).toBeDefined();
      expect(body.response.service.time).toMatch(/^\d+\(ms\)$/);

      // status
      expect(body.response.status).toBe("ERROR");

      // error
      expect(body.response.error?.code).toBe("INVALID_KEY");
      expect(body.response.error?.text).toBe("등록되지 않은 인증키입니다.");

      // body
      expect(body.response.record).toBeUndefined();
      expect(body.response.page).toBeUndefined();
    });
  });

  it("should return a success response", async () => {
    await searchGeocode("서울특별시 중구 세종대로 110", {
      key,
      type: "ROAD",
    }).then(async (result) => {
      expect(result.ok).toBe(true);
      const body = await result.json();
      console.log(body);
      expect(body.response.service.name).toBe("address");
      expect(body.response.service.version).toBe("2.0");
      expect(body.response.service.operation).toBe("getCoord");
      expect(body.response.service.time).toBeDefined();
      expect(body.response.service.time).toMatch(/^\d+\(ms\)$/);

      // status
      expect(body.response.status).toBe("OK");

      // error
      expect(body.response.error).toBeUndefined();

      // body
      expect(body.response.refined).toBeDefined();
      expect(body.response.result).toBeDefined();
      expect(body.response.refined!.text).toBe(
        "서울특별시 중구 세종대로 110 (태평로1가)"
      );
      console.log(body.response.refined!.structure);
      expect(body.response.refined!.structure).toBeDefined();
      expect(body.response.result!.crs).toBe("EPSG:4326");
      console.log(body.response.result!.point);
      expect(body.response.result!.point).toBeDefined();
      expect(body.response.result!.point!.x).toBe("126.978346780");
      expect(body.response.result!.point!.y).toBe("37.566700969");
      // expect(body.response.result!.point!.latitude).toBe(37.517952);
      // expect(body.response.result!.point!.longitude).toBe(126.994528);
    });
  });
});
