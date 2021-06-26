# mangadex-react

This project started to resemble old version of MangaDex using V5 API. 
Due to CORS problems, I'm using electron to make it an desktop application. 
> Probably doesn't work if the window width < 1280px
> This project is for my personal use and I suck at UI (I'm sorry) 
## Major Dependencies

* [MangaDex API](https://api.mangadex.org/swagger.html)
* [React](https://github.com/facebook/react)
* [Tailwind](https://github.com/tailwindlabs/tailwindcss)
* [Electron](https://github.com/electron/electron)
* [Axios](https://github.com/axios/axios)
* [Luxon](https://github.com/moment/luxon)

## Building

* AppImage: ```npm run electron-pack```
* deb: ```npm run electron-pack-deb```
* Windows: ```npm run electron-win``` 

## Special Thanks 

* [Lipis Flag Icons](https://github.com/lipis/flag-icon-css)