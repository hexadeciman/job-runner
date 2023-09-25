import axios from "axios";
import { platform1Config } from "./paltformsConfigs/config1";
import { insertMatches, queryDB } from "../utils/db";
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
        const matchesCount = await insertMatches(results);
        // find new matches and send notifications
        const { data: newMatches }: any = await queryDB(lastNRowsQuery, [`${matchesCount}`]);
        await notifyServices(newMatches);
        return true;
    } catch(e) {
        return false;
    };
}