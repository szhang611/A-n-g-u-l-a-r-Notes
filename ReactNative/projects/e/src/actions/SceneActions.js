import { APIService } from '../services/APIService';
import urls from '../services/APIUrl';
import { ThirdPartyAPI } from '../services/ThirdPartyAPIService';


/**
 * Switch to next or previous scene
 * @param {*} app 
 * @param {*} init 
 * @param {*} type 
 */
export const changeScene = async (app, init, type) => {
    console.log('Start change scene...');
    let sceneNum = 0;
    let scene = 1;
    let data = Object.assign({}, init);
    let sceneObj = {};
    if (init.scenes && init.scenes.scenes) {
        sceneNum = init.scenes.scenes.length;
    }
    if ('toNext' == type) {
        if (init && init.scene.sceneid == sceneNum) {
            scene == 1;
        } else {
            scene = init.scene.sceneid ? (init.scene.sceneid + 1) : 1;
        }
    } else {
        if (init && init.scene.sceneid == 1) {
            scene == sceneNum;
        } else {
            scene = init.scene.sceneid ? (init.scene.sceneid - 1) : 1;
        }
    }
    sceneObj = generateSceneObj(scene, init.scenes, init.contentid);
    console.log('Get content: start...');
    let res = await APIService.getContent(app.sid, app.homeid, init.contentid, scene, 'all', 'json');
    console.log('Get content: end...');
    data.scene = sceneObj;
    data.products = res.products;
    data.cast = res.cast;
    data.location = res.location;
    data.productId = 1;
    return {
        type: type + 'Scene',
        payload: data
    }
}


/**
 * generate a scene object
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
 * Synch Scene
 * @param {*} app 
 * @param {*} init 
 */
export const synchScene = async (app, init, hamburgerActions) => {
    console.log('Start to synch scene...');
    let data = {};
    if(!init.globalMD) {
        data.globalMD = await APIService.getContent(app.sid, app.homeid, hamburgerActions.Live_CurrentVideoName, 0, 'globalmd', 'url');
    }
    let synchData = await APIService.synchScene(app.sid, app.homeid);
    let latestSceneid, contentid;
    if (synchData.hasData) {
        data.synchSceneSucceed = true;
        latestSceneid = synchData.data.sceneid;
        contentid = synchData.data.contentid;
        if (contentid) {
            console.log('Check contentid: start...');
            if (init.contentid == contentid) {
                console.log('Check sceneid: start...');
                if (latestSceneid && init.scene.sceneid != latestSceneid) {
                    console.log('Sceneid is different, start to get new content...');
                    let res = await APIService.getContent(app.sid, app.homeid, init.contentid, latestSceneid, 'all', 'json');
                    if(res != 'Response Timedout'){
                        data.scene = res.scenes ? generateSceneObj(latestSceneid, init.scenes, init.contentid) : null;
                        data.products = res.products === 'Error: 404' ? null : res.products;
                        data.cast = res.cast === 'Error: 404' ? null : res.cast;
                        data.location = res.location === 'Error: 404' ? null : res.location;
                        data.productId = 1;
                    }else {
                        data.synchSceneSucceed = false;
                    }
                }
                console.log('Sceneid not changed, do nothing...');
            } else {
                console.log('Contentid is different, start to do init...');
                let initData = await APIService.init_LiveVideo(app.sid, app.homeid);
                let contentData = await APIService.getContent(app.sid, app.homeid, initData.contentid, latestSceneid, 'all', 'json');
                if(initData != 'Response Timedout' && contentData != 'Response Timedout') {
                    data = Object.assign({}, initData, contentData);
                    data.synchSceneSucceed = true;
                } else {
                    data.synchSceneSucceed = false;
                }
            }
        } else {
            data.synchSceneSucceed = false;
        }
    } else {
        data.synchSceneSucceed = false;
    }
    data.loadingState = false;
    return {
        type: 'synchScene',
        payload: data
    }
}


/**
 * Get current contents
 * @param {*} app
 * @param {*} init
 * @param {*} scene id
 */
export const getCurrentContents = async (app, init, sceneID, contentid) => {
    console.log('Start to get current content...');
    let data = Object.assign({}, init);
    if(!init.globalMD) {
        data.globalMD = await APIService.getContent(app.sid, app.homeid, contentid, 0, 'globalmd', 'url');
    }
    let body = {
        sid: app.sid,
        homeid: app.homeid,
        contentid: contentid
    };

    let res = await APIService.getContent(app.sid, app.homeid, contentid, sceneID, 'all', 'json');
    if(res != 'Response Timedout') {
        console.log(res);
        if(res.location !== 'Error: 404') {
            let latitude = res.location[0].position.lat;
            let longitude = res.location[0].position.lng;
            if(latitude && longitude){
                data.foodList = await ThirdPartyAPI.yelp.searchFood(latitude,longitude);
                data.eventList = await ThirdPartyAPI.ticketMaster.searchEvent(latitude, longitude);
            }
        }
        data.scene = res.scenes ? generateSceneObj( sceneID, res.scenes, contentid) : null;
        data.products = res.products === 'Error: 404' ? null : res.products;
        data.cast = res.cast === 'Error: 404' ? null : res.cast;
        data.location = res.location === 'Error: 404' ? null : res.location;
        data.productId = 1;
        data.scenes= res.scenes ? res.scenes : null;
        data.contentid = contentid;
    }
    console.log("get current scene content");
    console.log(data)
    data.loadingState = false;
    return {
        type: 'getCurrentContents',
        payload: data
    }

}


/**
 * Get left bottom current contents
 */
export const getLeftBottomCurrentContents = async (app, init, sceneID, contentid) => {
    console.log('Start to get left bottom video current content...');
    let data = Object.assign({}, init);

    let res = await APIService.getContent(app.sid, app.homeid, contentid, sceneID, 'all', 'json');
    if(res != 'Response Timedout') {
        console.log(res);
        data.leftBottomScene = res.scenes ? generateSceneObj( sceneID, res.scenes, contentid) : null;
        data.products = res.products === 'Error: 404' ? null : res.products;
        data.productId = 1;
        data.leftBottomScenes= res.scenes ? res.scenes : null;
        data.leftBottomContentid = contentid;
    }
    console.log(data);
    return {
        type: 'getLeftBottomCurrentContents',
        payload: data
    }

};


/**
 * Change Loading State
 * @param {*} state
 */
export const changeLoadingState = (state) => {
    return {
        type: 'LoadingStatus',
        payload: {
            loadingState: state
        }
    }
}


/**
 * Get all products
 * @param {*} app
 * @param {*} init
 * @param {*} contentid
 */
export const getAllProducts = async(app, init, contentid) => {
    console.log('Start to get all products...');
    let data = {};

    let res = await APIService.getContent(app.sid, app.homeid, contentid, 'all', 'products', 'json');
    console.log(res);
    data.allProducts = res;
    return {
        type: 'getAllProducts',
        payload: data
    }
}


/**
 * Get all products mapping scene.
 * @param {*} app
 * @param {*} init
 * @param {*} contentid
 */
export const getAllProductsMapping = async(app, init, contentid) => {
    console.log('Start to get all products...');
    let data = {};

    let res = await APIService.getContent(app.sid, app.homeid, contentid, 'all', 'productmapping', 'json');
    console.log(res);
    data.allProductsMapping = res;
    return {
        type: 'getAllProductsMapping',
        payload: data
    }
};



/**
 * Get all locations
 * @param {*} app
 * @param {*} init
 * @param {*} contentid
 */
export const getAllLocation = async(app, init, contentid) => {
    console.log('Start to get all location...');
    let data;
    let res = await APIService.getContent(app.sid, app.homeid, contentid, 'all', 'location', 'json');
    if(res) {
        data = res.map((item, idx)=>{
            item.Image = urls.CDN_old + contentid + '/static/' + item.poster;
            return item;
        });
    } else {
        data = null
    }
    return {
        type: 'getAllLocation',
        payload: {
            data: data,
            contentid: contentid
        }
    }
};



