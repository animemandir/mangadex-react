import { Store } from 'tauri-plugin-store-api';

export async function saveStorage(){
    const store = new Store('.dex.dat');
    await store.clear();
    if(localStorage.theme){
        await store.set('theme',localStorage.theme);
    }
    if(localStorage.authToken){
        await store.set('authToken',localStorage.authToken);
    }
    if(localStorage.authUser){
        await store.set('authUser',localStorage.authUser);
    }
    if(localStorage.authExpire){
        await store.set('authExpire',localStorage.authExpire);
    }
    if(localStorage.authRefresh){
        await store.set('authRefresh',localStorage.authRefresh);
    }
    if(localStorage.refreshExpire){
        await store.set('refreshExpire',localStorage.refreshExpire);
    }
    if(localStorage.content){
        await store.set('content',localStorage.content);
    }
    if(localStorage.readingHistory){
        await store.set('readingHistory',localStorage.readingHistory);
    }
    if(localStorage.language){
        await store.set('language',localStorage.language);
    }
    if(localStorage.showReaderMenu){
        await store.set('showReaderMenu',localStorage.showReaderMenu);
    }
    if(localStorage.imageFit){
        await store.set('imageFit',localStorage.imageFit);
    }
    if(localStorage.readerlayout){
        await store.set('readerlayout',localStorage.readerlayout);
    }
    if(localStorage.showProgressBar){
        await store.set('showProgressBar',localStorage.showProgressBar);
    }
    if(localStorage.imageSource){
        await store.set('imageSource',localStorage.imageSource);
    }
    if(localStorage.original){
        await store.set('original',localStorage.original);
    }
    if(localStorage.pageLoad){
        await store.set('pageLoad',localStorage.pageLoad);
    }
    // await store.load();
    return true;
}

export async function loadStorage(){
    const store = new Store('.dex.dat');
    let keys = await store.keys();
    console.log(keys);
    let authToken = await store.get('authToken');
    let theme = await store.get('theme');
    let authUser = await store.get('authUser');
    let authExpire = await store.get('authExpire');
    let authRefresh = await store.get('authRefresh');
    let refreshExpire = await store.get('refreshExpire');
    let content = await store.get('content');
    let readingHistory = await store.get('readingHistory');
    let language = await store.get('language');
    let showReaderMenu = await store.get('showReaderMenu');
    let imageFit = await store.get('imageFit');
    let readerlayout = await store.get('readerlayout');
    let showProgressBar = await store.get('showProgressBar');
    let imageSource = await store.get('imageSource');
    let original = await store.get('original');
    let pageLoad = await store.get('pageLoad');

    localStorage.clear();
    if(authToken){
        localStorage.authToken = authToken;
    }
    if(theme){
        localStorage.theme = theme;
    }
    if(authUser){
        localStorage.authUser = authUser;
    }
    if(authExpire){
        localStorage.authExpire = authExpire;
    }
    if(authRefresh){
        localStorage.authRefresh = authRefresh;
    }
    if(refreshExpire){
        localStorage.refreshExpire = refreshExpire;
    }
    if(content){
        localStorage.content = content;
    }
    if(language){
        localStorage.language = language;
    }
    if(readingHistory){
        localStorage.readingHistory = readingHistory;
    }
    if(showReaderMenu){
        localStorage.showReaderMenu = showReaderMenu;
    }
    if(imageFit){
        localStorage.imageFit = imageFit;
    }
    if(readerlayout){
        localStorage.readerlayout = readerlayout;
    }
    if(showProgressBar){
        localStorage.showProgressBar = showProgressBar;
    }
    if(imageSource){
        localStorage.imageSource = imageSource;
    }
    if(original){
        localStorage.original = original;
    }
    if(pageLoad){
        localStorage.pageLoad = pageLoad;
    } 
    return true;
}
