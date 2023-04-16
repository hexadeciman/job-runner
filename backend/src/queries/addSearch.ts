export const addSearchQuery = `
    INSERT INTO t_search (search_query, description, included_keywords, excluded_keywords, platform)
    VALUES (?, ?, ?, ?, ?);
`;