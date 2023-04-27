const makeRegexpList = (whiteList: string) =>
  whiteList.split(",").map((item) => new RegExp(`\\b${item.toLowerCase().trim()}\\b`));
export const includesSomeWords = (string: string, whiteList: string) => {
  const whitelistRegexpArr = makeRegexpList(whiteList);
  return whitelistRegexpArr.some((item) => item.test(string.toLowerCase()));
};
