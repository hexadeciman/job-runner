import axios from "axios";
import { platform1Config } from "./paltformsConfigs/config1";
import { insertValues, queryDB } from "../utils/db";
import { insertMatchesQuery } from "../queries/insertMatches";
import { escape } from 'sqlstring';
import { lastNRowsQuery } from "../queries/lastNRows";
import { notifyServices } from "../utils/notify";
import { includedExcludedListQuery } from "../queries/includedExcludedListQuery";
export const pingPlatform1 = async () => {

    const { url, params, processResult } = platform1Config;
    try {
        const { data } = await axios.post(url, params)

        // get included_keywords and excluded_keywords
        const { data: incl_excl_list }: any = await queryDB(includedExcludedListQuery, [1]); 
        let included_keywords = "";
        let excluded_keywords = "";

        if (incl_excl_list.length) {
            included_keywords = incl_excl_list[0].included_keywords ?? "";
            excluded_keywords = incl_excl_list[0].excluded_keywords ?? "";
        }
        const results = processResult(data, included_keywords, excluded_keywords);
        const matches = results.reduce(
            (acc, { add_id, date_created, address, coordinates, price, photos, description, contact, link }) =>  [...acc, [add_id, date_created, escape(address), coordinates, price, photos, escape(description), contact, 0, link]]
        , []);
        const { data: insertRes }: any = await insertValues(
            insertMatchesQuery,
            matches
        );
        const matchesCount = insertRes.affectedRows
        // find new matches and send notifications
        const { data: newMatches }: any = await queryDB(lastNRowsQuery, [`${matchesCount}`]);
        await notifyServices(newMatches);
        return true;
    } catch(e) {
        return false;
    };
}