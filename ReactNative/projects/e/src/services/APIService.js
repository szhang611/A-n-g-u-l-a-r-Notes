/***********************
 *  ALL EE App APIs V1.3
 *  Author: Ken Tao
 *  Date: 2017.9.18
 ***********************/

import {AlertIOS} from 'react-native';

import AllUrls from './APIUrl';
import Request from './Request';
import { parseRes } from '../utils/Util';
import urls from './APIUrl';


let taxonomies = {};
let scenes = [];
let sceneObj = {};

let products = [];
let cast = {};
let location = {};


/**
 * Login
 * @param {*} user
 * @param {*} password
 */
login = async (user, password) => {
    // case insensitive
    let response = await Request.Post(AllUrls.loginUrl, { user: user.trim().toLowerCase(), password: password.trim().toLowerCase() });
    return await response.json();
}


/**
 * init LiveVideo
 */
init_LiveVideo = async (sid, homeid) => {
    console.log('Start to get global data...');
    let body = {
        sid: sid,
        homeid: homeid
    }
    let sceneid = 1;
    let contentId = ''
    let global_MD = {}

    let synch = await Request.Post(AllUrls.synchUrl, body);
    let synchData = await synch.json();
    let SynchRes = parseRes(synchData, 'synch', AllUrls.synchUrl);
    let SynchHasData = SynchRes.hasData;
    synchData = SynchRes.data;
    if (SynchHasData) {
        contentId = synchData.contentid;
        sceneid = synchData.sceneid;
        global_MD = synchData.globalMD;
    } else {
        console.log('the second time...... ' + AllUrls.synchUrl)
        let synch = await Request.Post(AllUrls.synchUrl, body);
        let synchData = await synch.json();
        let SynchRes = parseRes(synchData, 'synch',AllUrls.synchUrl);
        let SynchHasData = SynchRes.hasData;
        synchData = SynchRes.data;
        if (SynchHasData) {
            contentId = synchData.contentid;
            sceneid = synchData.sceneid;
            global_MD = synchData.globalMD;
        } else {
            console.log('the third time...... ' + AllUrls.synchUrl)
           let synch = await Request.Post(AllUrls.synchUrl, body);
           let synchData = await synch.json();
           let SynchRes = parseRes(synchData, 'synch',AllUrls.synchUrl);
           let SynchHasData = SynchRes.hasData;
            synchData = SynchRes.data;
            if (SynchHasData) {
                contentId = synchData.contentid;
                sceneid = synchData.sceneid;
                global_MD = synchData.globalMD;
            } else {
                return 'Response Timedout';
            }
        }
    }
    return {
        contentid: contentId,
        sceneid: sceneid,
        globalMD: global_MD,
        productId: 1
    }
}


/**
 * get content
 */
getContent = async (sid, homeid, contentid, sceneid, taxonomies, format) => {
    console.log('Start to get content data...');
    let body = {
        sid: sid,
        homeid: homeid,
        contentid: contentid,
        sceneid: "" + sceneid,
        taxonomies: taxonomies,
        format: format
    };
    let globalMD_results;
    let Content = await Request.Post(AllUrls.getContentUrl, body);
    let ContentData = await Content.json();
    if(taxonomies === 'globalmd') {
        let Contents = JSON.parse(ContentData['ee_result']); // Data ==> "ee_result": "{\"globalmd\": \"http://114.31.83.55/mwm3-core/rest/asset/Friends-701_mas.json\"}",
        let Res = await fetch(Contents['globalmd']);
        globalMD_results = await Res.json();
        return globalMD_results;
    }
    if(taxonomies === 'products') {
        let allProducts = JSON.parse(ContentData['ee_result']);
        let res = [];
        for(let i=0;i<allProducts['products'].length;i++) {
            res = [...res, ...allProducts['products'][i].value];
        }
        return res;
    }
    if(taxonomies === 'productmapping') {
        let allProductsMapping = JSON.parse(ContentData['ee_result']);
        let res = Object.values(allProductsMapping.product_scene_mapping);
        return res;
    }
    if(taxonomies === 'location') {
        let allLocation = JSON.parse(ContentData['ee_result']);
        let res = [];
        if(allLocation && allLocation.location) {
            for(let i=0;i< allLocation['location'].length;i++) {
                res = [...res, ... allLocation['location'][i].value];
            }
            return res;
        } else {
            return null;
        }
    }
    let taxonomiesTemp = await APIService.requestTax(urls.getTaxUrl, body)
    let taxonomies1 = await taxonomiesTemp.json();
    let taxomomyObj = filterTaxonomy(taxonomies1.taxonomy);


    let ContentRes = parseRes(ContentData, 'tax', AllUrls.getContentUrl);
    let CHasData = ContentRes.hasData;
    ContentData = ContentRes.data;
    if (CHasData) {
        products = ContentData.products;
        cast = ContentData.cast;
        location = ContentData.location;
    } else {
        return 'Response Timedout';
    }
    console.log('End to get content data...');
    if(taxomomyObj.scenes) {
        console.log('Start to get scenes data...');
        await getTaxAndScenes(sid, homeid, contentid, sceneid);
        console.log('End to get scenes data...');
        return {
            products: products,
            cast: cast,
            location: location,
            taxonomy: taxomomyObj,
            scenes: scenes,
            scene: sceneObj
        }
    } else {
        return {
            products: products,
            cast: cast,
            location: location,
            taxonomy: taxomomyObj,
        }
    }
}


/**
 * get tax and scenes
 */
getTaxAndScenes = async (sid, homeid, contentid, sceneid) => {
    console.log('Start to get tax and scene data...');
    let body = {
        sid: sid,
        homeid: homeid,
        contentid: contentid
    }
    scenes = await requestTaxOrScenes(AllUrls.getScenesUrl, body, 'scenes');
    sceneObj = generateSceneObj(sceneid, scenes, contentid);
    console.log('End to get tax data...');
}


/**
 * request tax or scenes
 */
requestTaxOrScenes = async (url, body, type) => {
    let res = await Request.Post(url, body);
    let data = await res.json();
    let ParseRes = parseRes(data, 'tax', url);
    let hasData = ParseRes.hasData;
    let results = {};
    data = ParseRes.data;
    if (hasData) {
        let reqUrl = data[type];
        let Res = await fetch(reqUrl);
        results = await Res.json();
    } else {
        console.log('the second time...... ' + url)
         let res = await Request.Post(url, body);
         let data = await res.json();
         let ParseRes = parseRes(data, 'tax', url);
         let hasData = ParseRes.hasData;
         let results = {};
        data = ParseRes.data;
        if (hasData) {
            let reqUrl = data[type];
            let Res = await fetch(reqUrl);
            results = await Res.json();
        } else {
            console.log('the third time...... ' + url)
            let res = await Request.Post(url, body);
            let data = await res.json();
            let ParseRes = parseRes(data, 'tax', url);
            let hasData = ParseRes.hasData;
            let results = {};
            data = ParseRes.data;
            if (hasData) {
                let reqUrl = data[type];
                let Res = await fetch(reqUrl);
                results = await Res.json();
            }
        }
    }
    return results;
}

/**
 * request taxonomy
 */
requestTax = async (url, body) => {
    let res = await Request.Post(url, body);
    let data = await res.json();
    let ParseRes = parseRes(data, 'tax', url);
    let hasData = ParseRes.hasData;
    let results = {};
    if( hasData ){
        results = await fetch(ParseRes.data.taxonomy);
    }
    return results;
};

/**
 * request taxonomy object
 */
filterTaxonomy = (taxo)=>{
    let taxonomy = {};
    taxo.forEach((item, idx)=>{
        if(item.typeId === 'products') {
            taxonomy.products = item.enable;
        }
        if(item.typeId === 'location') {
            taxonomy.location = item.enable;
        }
        if(item.typeId === 'cast') {
            taxonomy.cast = item.enable;
        }
        if(item.typeId === 'scenes') {
            taxonomy.scenes = item.enable;
        }
    });
    console.log(taxonomy);
    return taxonomy;
};


/**
 * generate scene object
 */
generateSceneObj = (scene, scenes, content) => {
    let object = {
        sceneid: scene,
        start: 0,
        end: 0
    };
    let cdn = urls.CDN_old;
    let imageUri = cdn + content + '/' + scene + '/static/thumbnail.jpg';
    for (let i = 0; i < scenes.scenes.length; i++) {
        if (scenes.scenes[i].sceneId == scene) {
            object.start = scenes.scenes[i].start;
            object.end = scenes.scenes[i].end;
        }
    }
    object.image = imageUri;
    return object;
}


/**
 * synch scene
 */
synchScene = async (sid, homeid) => {
    let body = {
        sid: sid,
        homeid: homeid
    }
    let res = await Request.Post(AllUrls.synchSceneUrl, body);
    let resData = await res.json();
    let data = parseRes(resData, 'synch', AllUrls.synchSceneUrl);
    console.log('await Request.Post(AllUrls.synchSceneUrl, body) :1: ' + data);
    return data;
}


getUserProfileDetails = async(username) => {
    let res = await fetch(urls.getUserProfileUrl+username);
    let res_response = await res.json();
    if(res_response.status === 'success') {
        return res_response.socialResponse;
    }
};

addShareRequest = async(username, sharedBy, content) => {

    let shareReq = { poster :  `http://114.31.83.55/metadata/${content.contentid}/1/static/thumbnail.jpg`, sharedBy, contentid : content.contentid, offset: content.video.offset, sharedTime : new Date(), content: content}
    let response = await Request.Post(AllUrls.socialHost + `/users/${username}/addShareRequest`, shareReq);
    return await response.json();  
};

removeShareRequest = async(username, id) => {

    let response = await Request.Post(AllUrls.socialHost + `/users/${username}/removeShareRequest/${id}`);
    return response;  
};



getShareRequests = async(username) => {
    let res = await fetch(AllUrls.socialHost + `/users/${username}/shareRequests`);
    let res_response = await res.json();
    
    if(res_response.status === 'success') {
        return res_response.socialResponse;
    }
  
};



synchVideoOffset = async(body) => {
    let res = await  Request.Post(AllUrls.synchVideoUrl, body);
    res = await res.json();
    return parseRes(res, 'synch', AllUrls.synchVideoUrl);
};

// const addFavUrl = `${metaHost}`;  //      /users/:uid/merchindise/addFav
// const cancelFavUrl = `${metaHost}`;  //     /users/:uid/merchindise/cancelFav/:id
// const favouriteListUrl = `${metaHost}`; //    /users/:uid/merchindise/favouriteList

addFav = async(uid, body) => {
    let url = `${AllUrls.addFavUrl}/users/${uid}/merchindise/addFav`;
    let res = await  Request.Post(url, body);
    res = await res.json();
    return res;
};

cancelFav = async(uid, id) => {
    let url = `${AllUrls.cancelFavUrl}/users/${uid}/merchindise/cancelFav/${id}`;
    let res = await fetch(encodeURI(url));
    if(res.status === 200) {
        res = await res.json();
        return res;
    }
};

getFavouriteList = async(uid) => {
    let url = `${AllUrls.favouriteListUrl}/users/${uid}/merchindise/favouriteList`;
    let res = await fetch(url);
    res = await res.json();
    return res;
};

updateProfileTabSettings = async(uid, body) => {
    let url = `${AllUrls.favouriteListUrl}/users/${uid}/profile/setting`;
    let res = await  Request.Post(url, body);
    res = await res.json();
    return res;
};

getFriendsWatchingList = async(uid) => {
    let url = `${AllUrls.getFriendsWatchingListUrl}/users/${uid}/getFriendsWatchingList`;
    let res = await fetch(url);
    res = await res.json();
    return res;
};

getFriendsAvatarList = async()=>{
    let url = `${AllUrls.socialHost}/users/friendsAvatarList`;
    let res = await fetch(url);
    res = await res.json();
    return res;
};


export const APIService = {
    addShareRequest,
    removeShareRequest,
    getShareRequests,
    login,
    init_LiveVideo,
    getContent,
    synchScene,
    requestTax,
    getUserProfileDetails,
    synchVideoOffset,
    addFav,
    cancelFav,
    getFavouriteList,
    updateProfileTabSettings,
    getFriendsWatchingList,
    getFriendsAvatarList,
};

