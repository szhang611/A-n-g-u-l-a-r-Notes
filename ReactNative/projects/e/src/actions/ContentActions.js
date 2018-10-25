import { APIService } from '../services/APIService';

/**
 * content action creator
 * @param {*} app 
 * @param {*} init 
 */
export const getContent = async (app, init) => {
    let data = {};
    let sid = app.sid;
    let homeid = app.homeid;
    let contentid = init.contentid;
    let sceneid = init.sceneid;
    if (sid && homeid && contentid && sceneid) {
        data = await APIService.getContent(sid, homeid, contentid, sceneid, 'all', 'json').then(data => {
            return data;
        }).catch(reason => {
            // type = 'logout';
            console.log('Get content failed, will try again...,' + reason.message);
            return {
                failReason: 'Get content failed, please try again.'
            }
        });
    }
    return {
        type: 'getContent',
        payload: data
    };
};