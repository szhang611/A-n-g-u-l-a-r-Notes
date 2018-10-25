/**
 * product action creator
 * @param {*} init 
 * @param {*} productId 
 */
export const chooseProduct = (init, productId) => {
    let data = {};
    // product id from each scene
    data.productId = productId;
    // productId_SelectedContent id from view all
    data.productId_SelectedContent = -1;
    data.productId_SelectedContent_sceneId = null;
    return {
        type: 'changeProduct',
        payload: data
    }
};

/**
 * product action creator
 * @param {*} init
 * @param {*} productId
 */
export const choose_SelectedContent_Product = (init, productId, sceneId) => {
    let data = {};
    // productId_SelectedContent id from view all
    data.productId_SelectedContent = productId;
    // product id from each scene
    data.productId = -1;
    data.productId_SelectedContent_sceneId = sceneId;
    return {
        type: 'change_SelectedContent_Product',
        payload: data
    }
};

