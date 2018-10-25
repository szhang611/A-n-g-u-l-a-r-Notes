export const appInitialState = {
    hasLogin: false,
    hasLoading: false,
    failReason: '',
    homeid: '',
    sid: '',
    frequency: 10
};

export default (
    state = appInitialState,
    action = {}
) => {
    switch (action.type) {
        case 'login': 
            return action.payload;
        case 'logout':
            return Object.assign({}, appInitialState, action.payload);
        case 'endLoading':
            return Object.assign({}, state, {
                hasLoading: action.payload
            });
        default:
            return state;
    }
}