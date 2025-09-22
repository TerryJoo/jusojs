import type {
  ISearchAddressesOptions,
  ISearchAddressesResponse,
} from "./types";

export async function findAddresses(
  keyword: string,
  {
    countPerPage = 10,
    currentPage = 1,
    resultType = "json",
    confirmKey,
  }: Partial<ISearchAddressesOptions> = {}
): Promise<ISearchAddressesResponse> {
  if (!confirmKey) {
    throw new Error("confmKey is required.");
  }
  const params = new URLSearchParams();
  params.append("confmKey", confirmKey);
  params.append("currentPage", currentPage.toString());
  params.append("countPerPage", countPerPage.toString());
  params.append("keyword", keyword);
  params.append("resultType", resultType);

  return fetch("https://business.juso.go.kr/addrlink/addrLinkApi.do", {
    method: "POST",
    body: params,
  }) as Promise<ISearchAddressesResponse>;
}
