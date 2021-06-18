import { DateTime } from "luxon";
import axios from 'axios';

export let isLogged = () => {
    let isLogin = false;
    if(localStorage.authExpire){
        let now = DateTime.now();
        console.log(localStorage.authExpire,now.toFormat("X"));
        if(localStorage.authExpire > now.toFormat("X")){
            isLogin = true;
        }else if(localStorage.refreshExpire > now.toFormat("X")){
            axios.post('https://api.mangadex.org/auth/refresh',{
                token: localStorage.authRefresh,
            })
            .then(function(response){
                if(response.data.result == "ok"){
                    localStorage.authToken = response.data.token.session;
                    let now = DateTime.now().plus({days: 1});
                    localStorage.authExpire = now.toSeconds();
                    localStorage.authRefresh = response.data.token.refresh;
                    let nowRef = DateTime.now().plus({days: 30});
                    localStorage.refreshExpire = nowRef.toSeconds();

                    return true;
                }

                return false;
            })
            .catch(function(error){
                console.log(error);
                return false;
            });
        }
    }

    return isLogin;
}

