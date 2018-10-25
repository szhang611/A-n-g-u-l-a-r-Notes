export const mainPageInitialState = {
    hamburgerMenuSelect: 'Home',
    Recorded_CurrentVideoName: '',
    Recorded_CategoryToVideo: true,
    Recorded_seekTo: 0,
    Live_CurrentVideoName: '',
    Live_CategoryToVideo: true,
    Live_seekTo: 0,
    LeftTopVideoMode: '',
};

export default (state = mainPageInitialState, action = {}) => {
    switch (action.type) {
        case 'switch component':
            return Object.assign({}, state, action.payload);
        case 'liveStatus':
            return Object.assign({}, state, action.payload);
        case 'Recorded-CategoryToVideo':
            return Object.assign({}, state, action.payload);
        case 'Live-CategoryToVideo':
            return Object.assign({}, state, action.payload);
        case 'Current Hamburger MarkAt':
            return {...state, currentHamburgerMarkAt: action.payload.currentHamburgerMarkAt, displayHamburgerMenuList: action.payload.displayHamburgerMenuList};
        case 'LeftTop video mode':
            // return Object.assign({}, state, {LeftTopVideoMode: action.payload});
            return {...state, LeftTopVideoMode: action.payload};
        default:
            return state;
    }
}