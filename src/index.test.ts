import { describe, expect, it } from "@jest/globals";

// 간단한 유틸리티 함수들 (예제)
export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export function isEven(num: number): boolean {
  return num % 2 === 0;
}

// 테스트 케이스들
describe("Math utilities", () => {
  describe("add", () => {
    it("should add two positive numbers correctly", () => {
      expect(add(2, 3)).toBe(5);
    });

    it("should add negative numbers correctly", () => {
      expect(add(-2, -3)).toBe(-5);
    });

    it("should add positive and negative numbers correctly", () => {
      expect(add(5, -3)).toBe(2);
    });

    it("should handle zero correctly", () => {
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
    });
  });

  describe("multiply", () => {
    it("should multiply two positive numbers correctly", () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it("should multiply by zero correctly", () => {
      expect(multiply(5, 0)).toBe(0);
    });

    it("should multiply negative numbers correctly", () => {
      expect(multiply(-2, 3)).toBe(-6);
    });
  });

  describe("isEven", () => {
    it("should return true for even numbers", () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(4)).toBe(true);
      expect(isEven(100)).toBe(true);
    });

    it("should return false for odd numbers", () => {
      expect(isEven(1)).toBe(false);
      expect(isEven(3)).toBe(false);
      expect(isEven(99)).toBe(false);
    });

    it("should handle zero correctly", () => {
      expect(isEven(0)).toBe(true);
    });
  });
});

describe("String utilities", () => {
  describe("greet", () => {
    it("should greet with a name", () => {
      expect(greet("World")).toBe("Hello, World!");
    });

    it("should greet with empty string", () => {
      expect(greet("")).toBe("Hello, !");
    });

    it("should greet with special characters", () => {
      expect(greet("김철수")).toBe("Hello, 김철수!");
    });
  });
});

// 비동기 함수 테스트 예제
export async function fetchData(): Promise<{ id: number; name: string }> {
  // 실제로는 API 호출을 시뮬레이션
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, name: "Test Data" });
    }, 100);
  });
}

describe("Async utilities", () => {
  describe("fetchData", () => {
    it("should fetch data successfully", async () => {
      const data = await fetchData();
      expect(data).toEqual({ id: 1, name: "Test Data" });
    });

    it("should have correct data structure", async () => {
      const data = await fetchData();
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("name");
      expect(typeof data.id).toBe("number");
      expect(typeof data.name).toBe("string");
    });
  });
});
