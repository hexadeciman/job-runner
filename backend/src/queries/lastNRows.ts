export const lastNRowsQuery = `
  SELECT * FROM t_match ORDER BY id DESC LIMIT ?;
`;
