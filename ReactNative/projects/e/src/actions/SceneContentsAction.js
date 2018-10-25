import { APIService } from '../services/APIService';
import urls from '../services/APIUrl';

/**
 * Get current contents
 * @param {*} app
 */
export const getLatestScene = async (app) => {
    console.log('Start to get latest scene...');
    let data = Object.assign({});
    let synchData = await APIService.synchScene(app.sid, app.homeid);
    let latestSceneid;
    if (synchData.hasData) {
        latestSceneid = synchData.data.sceneid;
        data.latestSceneid = latestSceneid;
    }
    return {
        type: 'getLatestScene',
        payload: data
    }
}

export const callbackWebViewUrl = (val) => {
    return {
        type: 'callbackWebViewUrl',
        payload: val
    }
}