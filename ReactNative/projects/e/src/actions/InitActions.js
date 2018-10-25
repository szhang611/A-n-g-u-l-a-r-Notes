import { APIService } from '../services/APIService';


/**
 * init action creator
 * @param {*} sid 
 * @param {*} homeid 
 */
export const init = async (sid, homeid) => {
    let type = 'init';
    let data = await APIService.init(sid, homeid).then(data => {
        return data;
    }).catch(reason => {
        type = 'logout';
        return {
            failReason: 'request timeout, please try again!'
        }
    });
    return {
        type: type,
        payload: data
    };
};




/**
 *  Reset Init State
 */
export const resetInitStateAction = () => {
    return {
        type: 'resetInitState',
        payload: {
            globalMD: null,
            products: null,
            productId: -1,
            productId_SelectedContent: -1,
            allLocation: null,
            allProducts: null,
            allProductsMapping: null,
            productId_SelectedContent_sceneId: null,
            cast: null,
            contentid: null,
            location: null,
            scene: null,
            sceneid: null,
            scenes: null,
            taxonomy: null,
            synchSceneSucceed: false,
        }
    }
};



/**
 *  Emit userJoined
 */
export const emitUserJoined_action = (joint) => {
    return {
        type: 'UserJoined_Emitted',
        payload: joint
    }
};



/**
 *  Emit
 */
export const emitMoveOnAvatar = (num) => {
    return {
        type: 'MoveOnAvatar_Emitted',
        payload: num
    }
};


/**
 *  Emit
 */
export const saveFriendsList = (list) => {
    return {
        type: 'saveFriendsList',
        payload: list
    }
};


/**
 *  Emit
 */
export const videoReceivedFromFriendShared = (video, vid) => {
    video.vId = vid
    return {
        type: 'videoReceivedFromFriendShared',
        payload: {
            videoContent_ReceivedFromFriendShared: video
        }
    }
};


