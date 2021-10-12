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
    safe: "Safe",
    suggestive: "Suggestive",
    erotica: "Erotica",
    pornographic: "Pornographic",
}

const originalLanguage = {
    ja: 'Japanese',
    ko:'Korean',
    zh: 'Chinese',
    'zh-hk': 'Chinese (HK)',
    id: 'Indonesia',
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

const mangaRelation = {
    monochrome: "Monochrome",
    main_story: "Main Story",
    adapted_from: "Adapted from",
    based_on: "Based on",
    prequel: "Prequel",
    side_story: "Side Story",
    doujinshi: "Doujinshi",
    same_franchise: "Same Franchise",
    shared_universe: "Shared Universe",
    sequel: "Sequel",
    spin_off: "Spin Off",
    alternate_story: "Alternate Story",
    preserialization: "Preserialization",
    colored: "Colored",
    serialization: "Serialization"
}

export{
    demographic,
    mangaStatus,
    mangaReadingStatus,
    mangaContentRating,
    customListVisibility,
    mangaLinks,
    originalLanguage,
    mangaRelation
}