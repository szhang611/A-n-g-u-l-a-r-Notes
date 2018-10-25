export const socialInitialState = {
    socialType: 'E3',
    messages: null,
    emittedMessage: null,
    broadcastMessage: null,
};

export default (state = socialInitialState, action = {}) => {
    switch (action.type) {
        case 'sendSocialMessages':
        case 'emitSocialMessages':
        case 'jointChatRoom':
        case 'broadcastSocialMessages':
        case 'imageRange':
        case 'shareVideo':
        case 'friendsOnline':
        case 'videoQueue':
        case 'friendsOffiline':
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}