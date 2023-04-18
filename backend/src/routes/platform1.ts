import axios from "axios";
import { platform1Config } from "./paltformsConfigs/config1";
import { insertValues, queryDB } from "../utils/db";
import { insertMatchesQuery } from "../queries/insertMatches";
import { escape } from 'sqlstring';
import { lastNRowsQuery } from "../queries/lastNRows";
import { notifyServices } from "../utils/notify";
export const pingPlatform1 = async () => {

    const { url, params, processResult } = platform1Config;
    try {
        const { data } = await axios.post(url, params)
        const results = processResult(data);
        const matches = results.reduce(
            (acc, { add_id, date_created, address, coordinates, price, photos, description, contact, link }) =>  [...acc, [add_id, date_created, escape(address), coordinates, price, photos, escape(description), contact, 0, link]]
        , []);
        const { data: insertRes }: any = await insertValues(
            insertMatchesQuery,
            matches
        );
        const matchesCount = insertRes.affectedRows
            console.log(matchesCount);
            // find new matches and send notifications
            const { data: newMatches }: any = await queryDB(lastNRowsQuery, [
                matchesCount,
            ]);
            await notifyServices(newMatches);
        return true;
    } catch(e) {
        return false;
    };
}