export const initInitialState = {
    globalMD: null,
    products: null,
    productId: -1, //default product display on 'retail' tab
    productId_SelectedContent: -1,
    UserJoined_Emitted: false,
};

export default (state = initInitialState, action = {}) => {[[]]
    switch (action.type) {
        case 'init': // init synch
            return Object.assign({}, state, action.payload);
        case 'logout': // manually logout or cause by error
            return initInitialState;
        case 'synchScene': // synch scene
        case 'getCurrentContents': // get current content data
        case 'getLeftBottomCurrentContents': // get current left bottom video content data
        case 'changeProduct': // change product
            // case 'getLatestScene': // get latest scene
        case 'change_SelectedContent_Product': // change product
        case 'LoadingStatus': // change loading state
        case 'getContent': // get content data
        case 'getAllProducts': // get all products data
        case 'getAllProductsMapping': // get all products mapping scene data
            return Object.assign({}, state, action.payload);

        case 'getAllLocation': // get all location data
            return {...state, allLocation: action.payload.data, contentid: action.payload.contentid};

        case 'callbackWebViewUrl': // get all location data
            return {...state, callbackWebViewUrl: action.payload};

        case 'UserJoined_Emitted':
            return {...state, UserJoined_Emitted: action.payload};

        case 'MoveOnAvatar_Emitted':
            return {...state, MoveOnAvatarNumber_Header: action.payload};
        case 'saveFriendsList':
            return {...state, saved_friends_list: action.payload};
        case 'videoReceivedFromFriendShared':
            return Object.assign({}, state, action.payload);

        case 'resetInitState': // reset initState
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}