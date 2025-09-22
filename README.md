# jusojs

TypeScript client library for Korean address services, providing both address search and geocoding functionality using official Korean APIs.

- **Address Search**: Uses the official [juso.go.kr](https://business.juso.go.kr/addrlink/openApi/searchApi.do) API
- **Geocoding**: Uses the official [vworld.kr](https://www.vworld.kr/dev/v4dv_geocoderguide2_s001.do) API

## Installation

```bash
npm install jusojs
```

## Usage

### Basic Setup

You need to obtain API keys for both services:

1. **Juso API Key**: Get a confirmation key from the [juso.go.kr API service](https://business.juso.go.kr/addrlink/openApi/searchApi.do)
2. **VWorld API Key**: Get an API key from the [vworld.kr developer portal](https://www.vworld.kr/dev/v4dv_geocoderguide2_s001.do)

Set your API keys as environment variables:

```bash
export JUSO_CONFIRM_KEY="your_juso_confirmation_key_here"
export VWORLD_KEY="your_vworld_api_key_here"
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

### Geocoding (Address to Coordinates)

Convert Korean addresses to latitude and longitude coordinates using the VWorld API:

```typescript
import { searchGeocode } from "jusojs";

// Basic geocoding
const result = await searchGeocode("서울특별시 중구 세종대로 110", {
  key: "your_vworld_api_key", // Optional if set in environment
  type: "ROAD", // or "PARCEL"
});

// Parse the response
const data = await result.json();
if (data.response.status === "OK") {
  const { x, y } = data.response.result.point;
  console.log(`Longitude: ${x}, Latitude: ${y}`);
}
```

### Response Structure

#### Address Search Response

The Juso API returns detailed address information including:

- **Road Address**: Modern road-based address system
- **Jibun Address**: Traditional lot-based address system
- **Building Information**: Building names, numbers, and management codes
- **Administrative Codes**: City, district, and neighborhood codes
- **English Address**: English translation of the address

Example address search response:

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

#### Geocoding Response

The VWorld API returns coordinate information with the following structure:

- **Status**: Response status ("OK", "ERROR", "NOT_FOUND")
- **Coordinates**: Longitude (x) and Latitude (y) in EPSG:4326 format
- **Refined Address**: Standardized address format
- **Service Info**: API version and processing time

Example geocoding response:

```typescript
{
  response: {
    service: {
      name: "address",
      version: "2.0",
      operation: "getCoord",
      time: "31(ms)"
    },
    status: "OK",
    input: {
      type: "ROAD",
      address: "서울특별시 중구 세종대로 110"
    },
    refined: {
      text: "서울특별시 중구 세종대로 110 (태평로1가)",
      structure: { /* address structure */ }
    },
    result: {
      crs: "EPSG:4326",
      point: {
        x: "126.978346780", // Longitude
        y: "37.566700969"   // Latitude
      }
    }
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

### `searchGeocode(address, options?)`

Converts Korean addresses to coordinates using the VWorld API.

**Parameters:**

- `address` (string): Korean address to geocode
- `options` (object, optional):
  - `key` (string): VWorld API key (defaults to `VWORLD_KEY` env var)
  - `type` ("ROAD" | "PARCEL"): Address type (default: "ROAD")
  - `version` (string): API version (default: "2.0")
  - `crs` (string): Coordinate reference system (default: "epsg:4326")
  - `refine` (boolean): Whether to refine the address (default: true)
  - `simple` (boolean): Whether to return simplified response (default: false)
  - `format` (string): Response format (default: "json")

**Returns:** Promise<ISearchGeocodeResponse>

**Throws:** Error if `key` is not provided

## Types

The library provides comprehensive TypeScript types:

**Address Search Types:**

- `ISearchAddressesOptions`: Search parameters
- `ISearchAddressesResponse`: API response structure
- `IJuso`: Individual address data
- `ISearchAddressesResultCommon`: Response metadata

**Geocoding Types:**

- `ISearchGeocodeOptions`: Geocoding parameters
- `ISearchGeocodeResponse`: VWorld API response structure
- `ISearchGeocodeResponseBody`: Response body structure
- `VWorldError`: Error information from VWorld API

## About VWorld API

[VWorld](https://www.vworld.kr/) is Korea's national spatial information open platform operated by the Ministry of Land, Infrastructure and Transport. It provides various geospatial services including:

- **Geocoding**: Convert addresses to coordinates
- **Reverse Geocoding**: Convert coordinates to addresses
- **Map Services**: Various map tiles and services
- **Spatial Data**: Administrative boundaries, road networks, etc.

### VWorld Geocoding Features

- **High Accuracy**: Uses official Korean address databases
- **Multiple Address Types**: Supports both road addresses (도로명주소) and parcel addresses (지번주소)
- **Coordinate Systems**: Returns coordinates in EPSG:4326 (WGS84) format
- **Address Refinement**: Automatically standardizes and refines input addresses
- **Real-time Processing**: Fast response times for geocoding requests

### Getting VWorld API Key

1. Visit the [VWorld Developer Portal](https://www.vworld.kr/dev/v4dv_geocoderguide2_s001.do)
2. Register for a developer account
3. Create a new application to get your API key
4. Set the `VWORLD_KEY` environment variable with your API key

## Complete Example

Here's a complete example that demonstrates both address search and geocoding:

```typescript
import { searchAddresses, searchGeocode } from "jusojs";

async function findLocationInfo(keyword: string) {
  try {
    // Step 1: Search for addresses
    const addressResults = await searchAddresses(keyword);

    if (addressResults.results.juso.length > 0) {
      const firstAddress = addressResults.results.juso[0];
      console.log("Found address:", firstAddress.roadAddr);

      // Step 2: Get coordinates for the address
      const geocodeResult = await searchGeocode(firstAddress.roadAddr, {
        type: "ROAD",
      });

      const geocodeData = await geocodeResult.json();

      if (geocodeData.response.status === "OK") {
        const { x, y } = geocodeData.response.result.point;
        console.log(`Coordinates: ${y}, ${x}`); // Latitude, Longitude
        console.log(`Refined address: ${geocodeData.response.refined.text}`);
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Usage
findLocationInfo("강남구 도산대로");
```

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
