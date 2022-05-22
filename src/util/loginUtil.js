import { DateTime } from "luxon";
import axios from 'axios';
import { saveStorage } from "../util/persistentStore.js";

export async function isLogged(){
    if(localStorage.authExpire){
        let now = DateTime.now();
        if(localStorage.authExpire > now.toFormat("X")){
            return true;
        }else if(localStorage.refreshExpire > now.toFormat("X")){
            return await axios.post('https://api.mangadex.org/auth/refresh',{
                token: localStorage.authRefresh,
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

