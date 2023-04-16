export const addMatch = `
    INSERT INTO t_match (search_query, price, coordinates, link, photos, description, contact)
    VALUES ?;
`;