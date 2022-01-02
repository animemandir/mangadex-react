const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow = null;
app.on('ready',createWindow);
app.on('window-all-closed',function(){
    if(process.platform !== 'darwin'){
        app.quit();
    }
});
app.on('activate',function(){
    if(mainWindow === null){
        createWindow();
    }
});
function createWindow(){
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        title: "MangaDex",
        icon:  __dirname + '/icon.png'
    });
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    mainWindow.on('closed',function(){
        mainWindow = null;
    });
    mainWindow.on('page-title-updated',function(e){
        e.preventDefault();
    });
    mainWindow.webContents.on('new-window',function(e,url){
        e.preventDefault();
        require('electron').shell.openExternal(url);
    });
}