export const navState = {
    'from':  'Info',
    'from_subTab':  'home',
    'to': '',
    'to_subTab': '',
    'params': undefined
};

export default (state = navState, action = {}) => {
    switch (action.type) {
        case 'navigate':
           return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}