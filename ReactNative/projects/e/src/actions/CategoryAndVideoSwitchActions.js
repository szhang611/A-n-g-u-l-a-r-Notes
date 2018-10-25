import { APIService } from '../services/APIService';



/**
 * category to video play action creator - Recorded
 * @param {*}  videoName, actionBool
 */
export const switchRecordedCategoryVideo = (videoName, actionBool, seconds) => {
    if(!seconds) {
        seconds = 0;
    }
    const data = {
        Recorded_CurrentVideoName: videoName,
        Recorded_CategoryToVideo: actionBool,
        Recorded_seekTo: seconds,
        isLive: false
    };
    return {
        type: 'Recorded-CategoryToVideo',
        payload: data
    }
};


/**
 * category to video play action creator - Live
 * @param {*}  videoName, actionBool, seconds
 */
export const switchLiveCategoryVideo = (videoName, actionBool, seconds, clearInit = false) => {
    if(!seconds) {
        seconds = 0;
    }
    const data = {
        Live_CurrentVideoName: videoName,
        Live_CategoryToVideo: actionBool,
        Live_seekTo: seconds,
        isLive: true,
        clearInit: clearInit
};
    return {
        type: 'Live-CategoryToVideo',
        payload: data
    }
};

export const fetchLiveVideo = async (app) => {

    const data = {
        liveNow: false,
        liveContent : ''
    }

    let synchData = await APIService.synchScene(app.sid, app.homeid);
    let latestSceneid;
    if (synchData.hasData) {
        latestSceneid = synchData.data.sceneid;
        contentid = synchData.data.contentid;
        data.liveNow = latestSceneid !== 'None' 
        data.liveContent = contentid
    }

    return {
        type: 'liveStatus',
        payload: data

    }
}



/**
 * set LeftTop video mode
 * @param {*} mode
 */
export const setLeftTopVideoMode = (mode) => {
    return {
        type: 'LeftTop video mode',
        payload: mode
    }
};
