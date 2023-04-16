import { sendMessage, sendPhotos } from "../utils/notify";
import { fetchSearchesQuery } from "../queries/fetchSearch";
import { queryDB } from "../utils/db";
import { addSearchQuery } from "../queries/addSearch";

const randomImages = ["https://picsum.photos/id/237/200/300", "https://picsum.photos/200/300?grayscale"]

export const addRowToSearch = async () => {
    const { data: searches }: any = await queryDB(fetchSearchesQuery);
    console.log(searches);

    const values = {
        search_query: "3phmgt",
        description: "1700<val<3000",
        included_keywords: "",
        excluded_keywords:  "",
        platform: "hmgt"
    }
    const { data }: any = await queryDB(addSearchQuery, Object.values(values));
    return data;
}

export const botMessageTest = async () => {
   await sendMessage();
   return true;
}

export const botPhotoTest = async () => {
    await sendPhotos([randomImages[0]]);
    return true;
}

export const botGroupPhotoTest = async () => {
    await sendPhotos(randomImages);
    return true;
}