const demographic = {
    shounen: "Shounen",
    shoujo: "Shoujo",
    josei: "Josei",
    seinen: "Seinen",
}

const mangaStatus = {
    ongoing: "Ongoing",
    completed: "Completed",
    hiatus: "Hiatus",
    cancelled: "Cancelled",
}

const mangaReadingStatus = {
    reading: "Reading",
    on_hold: "On Hold",
    plan_to_read: "Plan to read",
    dropped: "Dropped",
    re_reading: "Rereading",
    completed: "Completed"
}

const mangaContentRating = {
    safe: "Safe Content",
    suggestive: "Suggestive Content",
    erotica: "Erotica Content",
    pornographic: "Pornographic Content",
}

const customListVisibility = {
    public: "Public",
    private: "Private"
}

const mangaLinks = {
    al: "Anilist", //https://anilist.co/manga/`{id}
    ap: "AnimePlanet", //https://www.anime-planet.com/manga/`{slug}`
    bw: "Bookwalker", //https://bookwalker.jp/`{slug}` 
    mu: "MangaUpdates", //https://www.mangaupdates.com/series.html?id=`{id}`
    nu: "NovelUpdates", //https://www.novelupdates.com/series/`{slug}` 
    kt: "Kitsu", //https://kitsu.io/api/edge/manga/`{id}`
    amz: "Amazon", //Stored as full URL
    ebj: "eBookJapan", //Stored as full URL
    mal: "MyAnimeList", //https://myanimelist.net/manga/{id} 
    raw: "Raw", //Stored as full URL
    engtl: "Official Translation", //Stored as full URL
}

export{
    demographic,
    mangaStatus,
    mangaReadingStatus,
    mangaContentRating,
    customListVisibility,
    mangaLinks
}