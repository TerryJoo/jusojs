import type {
  ISearchAddressesOptions,
  ISearchAddressesResponse,
} from "./types";

export async function searchAddresses(
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

  const e = await fetch("https://business.juso.go.kr/addrlink/addrLinkApi.do", {
    method: "POST",
    body: params,
  });
  const data = (await e.json()) as ISearchAddressesResponse;
  return {
    ...data,
    results: {
      ...data.results,
      common: {
        ...data.results.common,
        currentPage: Number(data.results.common?.currentPage),
        countPerPage: Number(data.results.common?.countPerPage),
        totalCount: Number(data.results.common?.totalCount),
      },
    },
  };
}
