const host = 'http://114.31.83.54:15080/opturl';
const cdn = 'http://114.31.83.54:8082/metadata/';
const cdn_old = 'http://114.31.83.55/metadata/';
// const loginUrl = `${host}/LoginV1`;
const loginUrl = `http://54.221.14.219:8080/login`;
const logoutUrl = `http://localhost:8080/logout`;
const socialHost = 'http://54.221.14.219:8080';
const metaHost = `http://54.221.14.219:8080/metadata`;
const synchUrl = `${metaHost}/SynchV1`;
const getTaxUrl = `${metaHost}/GetTaxV1`;
const getScenesUrl = `${metaHost}/GetScenesV1`;
const synchSceneUrl = `${metaHost}/SynchSceneV1`;
const synchVideoUrl = `${metaHost}/SynchVideoV1`;
const getContentUrl = `${metaHost}/GetContentV1`;
const getMethodsUrl = `${metaHost}/GetMethodsV1`;
const getUserProfileUrl = `http://54.221.14.219:8080/users/`;
const addVideoToQueue = '';

const addFavUrl = `${socialHost}`;  //      /users/:uid/merchindise/addFav
const cancelFavUrl = `${socialHost}`;  //     /users/:uid/merchindise/cancelFav/:id
const favouriteListUrl = `${socialHost}`; //    /users/:uid/merchindise/favouriteList
const updateProfileTabSettings = `${socialHost}`; //    /users/:uid/profile/setting
const getFriendsWatchingListUrl = `${socialHost}`; //    /users/:uid/getFriendsWatchingList

videoUri = (contentid) => {
    return `http://114.31.83.55/hls/${contentid}.mp4/master.m3u8`;
};
videoThumbnailImage = (contentid, sceneid, imageName) => {
    return `${cdn_old}${contentid}/${sceneid}/static/${imageName}`;
};


export default {
    socialHost,
    host: host,
    CDN: cdn,
    CDN_old: cdn_old,
    loginUrl: loginUrl,
    logoutUrl,
    synchUrl: synchUrl,
    getTaxUrl: getTaxUrl,
    getScenesUrl: getScenesUrl,
    synchSceneUrl: synchSceneUrl,
    synchVideoUrl: synchVideoUrl,
    getContentUrl: getContentUrl,
    getMethodsUrl: getMethodsUrl,
    getUserProfileUrl: getUserProfileUrl,
    addFavUrl,
    cancelFavUrl,
    favouriteListUrl,
    updateProfileTabSettings,
    getFriendsWatchingListUrl,
    videoUri,
    videoThumbnailImage
}