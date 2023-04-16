export const fetchSearchesQuery = `
    SELECT t1.id, t1.search_query, t1.description, t1.included_keywords, t1.excluded_keywords, t1.platform, t1.date_created
    FROM t_search t1
    WHERE t1.archived=0;
`;