import { DateTime } from "luxon";
import { saveStorage } from "../util/persistentStore.js";
import { fetch } from '@tauri-apps/api/http';
import { Body } from "@tauri-apps/api/http"

export async function isLogged(){
    if(localStorage.authExpire){
        let now = DateTime.now();
        if(localStorage.authExpire > now.toFormat("X")){
            return true;
        }else if(localStorage.refreshExpire > now.toFormat("X")){
            let body = Body.json({
                token: localStorage.authRefresh,
            })
            return await fetch('https://api.mangadex.org/auth/refresh',{
                method: "POST",
                body: body
            })
            .then(function(response){
                if(response.data.result === "ok"){
                    localStorage.authToken = response.data.token.session;
                    let now = DateTime.now().plus({minutes: 5});
                    localStorage.authExpire = now.toSeconds();
                    localStorage.authRefresh = response.data.token.refresh;
                    let nowRef = DateTime.now().plus({days: 30});
                    localStorage.refreshExpire = nowRef.toSeconds();
                    saveStorage();
                    return true;
                }else{
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("authUser");
                    localStorage.removeItem("authExpire");
                    localStorage.removeItem("authRefresh");
                    localStorage.removeItem("refreshExpire");
                    saveStorage();
                }

                return false;
            })
            .catch(function(error){
                console.log(error);
                localStorage.removeItem("authToken");
                localStorage.removeItem("authUser");
                localStorage.removeItem("authExpire");
                localStorage.removeItem("authRefresh");
                localStorage.removeItem("refreshExpire");
                saveStorage();
                return false;
            });
        }
    }

    return false;
}

