export const includedExcludedListQuery = `
    SELECT t1.included_keywords, t1.excluded_keywords
    FROM t_search t1
    WHERE t1.id=?;
`;