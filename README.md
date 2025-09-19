# jusojs

TypeScript client library for Korean road address search using the official [juso.go.kr](https://business.juso.go.kr/addrlink/openApi/searchApi.do) API.

## Installation

> **Note**: This package is not yet available on npm. Please install from the source or wait for the official release.

```bash
npm install jusojs
```

## Usage

### Basic Setup

First, you need to obtain a confirmation key from the [juso.go.kr API service](https://business.juso.go.kr/addrlink/openApi/searchApi.do).

Set your confirmation key as an environment variable:

```bash
export JUSO_CONFIRM_KEY="your_confirmation_key_here"
```

### Search Addresses

```typescript
import { searchAddresses } from "jusojs";

// Basic search
const results = await searchAddresses("강남구");

// Advanced search with options
const results = await searchAddresses("도산대로", {
  countPerPage: 20,
  currentPage: 1,
  confmKey: "your_confirmation_key", // Optional if set in environment
});

console.log(results);
```

### Response Structure

The API returns detailed address information including:

- **Road Address**: Modern road-based address system
- **Jibun Address**: Traditional lot-based address system
- **Building Information**: Building names, numbers, and management codes
- **Administrative Codes**: City, district, and neighborhood codes
- **English Address**: English translation of the address

Example response:

```typescript
{
  results: {
    common: {
      errorMessage: "정상",
      countPerPage: 10,
      totalCount: 2,
      errorCode: "0",
      currentPage: 1
    },
    juso: [
      {
        roadAddr: "서울특별시 강남구 도산대로 317 (신사동)",
        jibunAddr: "서울특별시 강남구 신사동 651-24 호림아트센터 1빌딩",
        engAddr: "317 Dosan-daero, Gangnam-gu, Seoul",
        zipNo: "06021",
        bdNm: "호림아트센터 1빌딩",
        // ... more fields
      }
    ]
  }
}
```

## API Reference

### `searchAddresses(keyword, options?)`

Searches for Korean addresses using the provided keyword.

**Parameters:**

- `keyword` (string): Search keyword (address, building name, etc.)
- `options` (object, optional):
  - `countPerPage` (number): Number of results per page (default: 10)
  - `currentPage` (number): Page number to retrieve (default: 1)
  - `resultType` (string): Response format (default: "json")
  - `confmKey` (string): API confirmation key (defaults to `JUSO_CONFIRM_KEY` env var)

**Returns:** Promise<ISearchAddressesResponse>

**Throws:** Error if `confmKey` is not provided

## Types

The library provides comprehensive TypeScript types:

- `ISearchAddressesOptions`: Search parameters
- `ISearchAddressesResponse`: API response structure
- `IJuso`: Individual address data
- `ISearchAddressesResultCommon`: Response metadata

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the library
npm run build

# Clean build artifacts
npm run clean
```

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
