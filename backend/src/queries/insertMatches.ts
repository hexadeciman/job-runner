export const insertMatchesQuery = `
    INSERT IGNORE INTO t_match (add_id, date_created, address, coordinates, price, photos, description, contact, fk_search, link) VALUES ?
`;
