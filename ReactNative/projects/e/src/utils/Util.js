/**
 * parse response from string to json format
 * @param {*} data 
 * @param {*} type 
 */
import {AlertIOS, Alert} from 'react-native'
import urls from '../services/APIUrl'
import {friendsAvatar} from "./globalEventEmitter";

export const parseRes = (data, type, url) => {
    let finalRes = '';
    let hasData = false;
    switch (type) {
        case 'login':
            finalRes = 'ee_login_response';
            break;
        case 'synch':
            finalRes = 'ee_response';
            break;
        case 'tax':
            finalRes = 'ee_result';
            break;
    }

    if(data[finalRes]){
        data = JSON.parse(data[finalRes]);
        hasData = true;
        // console.log('Util - parseRes : ' + data);
    } else {
        console.log('Timeout url : ' + url);
        data = 'Response Timedout';
    }

    return {
        data: data,
        hasData: hasData
    }
}



export const filterUserAvatar = (username) => {
    if(friendsAvatar && friendsAvatar.socialResponse) {
        for(let i=0;i<friendsAvatar.socialResponse.length;i++) {
            if(friendsAvatar.socialResponse[i].username === username) {
                if(friendsAvatar.socialResponse[i].avatar) {
                    return urls.socialHost + friendsAvatar.socialResponse[i].avatar;
                }else {
                    return urls.socialHost +'/static/friends/' + username +'.png' ;
                }
            }
        }

        /*  forEach not work  */
        // friendsAvatar.socialResponse.forEach((ava)=>{
        //     if(ava.username === username) {
        //         if(ava.avatar) {
        //             let url = urls.socialHost + ava.avatar;
        //             console.log('url : ' + url);
        //             return url;
        //         }else {
        //             return urls.socialHost +'/static/friends/' + username +'.png' ;
        //         }
        //     } else {
        //         return urls.socialHost +'/static/friends/' + username +'.png' ;
        //     }
        // });
    }
};



export const toHHMMSS = (secs) => {
    let sec_num = parseInt(secs, 10);
    let hours   = Math.floor(sec_num / 3600) % 24;
    let minutes = Math.floor(sec_num / 60) % 60;
    let seconds = sec_num % 60;
    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
};


