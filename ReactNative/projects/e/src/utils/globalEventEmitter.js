import EventEmitter from 'EventEmitter';

export const globalEventEmitter = new EventEmitter();

export const globalTabSwitchState = {
    shop: false,
    location: false,
    travel: false,
    social: false,
    viewing: false,
    browser: false,
};


export const friendsAvatar = {
    socialResponse: []
};

