import { APIService } from '../services/APIService';
import { parseRes } from '../utils/Util';
import { AsyncStorage } from 'react-native';
import { globalTabSwitchState, globalEventEmitter } from '../utils/globalEventEmitter';

/**
 * login action creator
 * @param {*} username 
 * @param {*} password 
 */
export const login = async (username, password) => {
    let result = false;
    let failReason = 'invalid username or password, please try again.';
    let homeid = '';
    let sid = '';
    let frequency = 10;
    let tabSwitch = {
        shop: false,
        location: false,
        travel: false,
        social: false,
        viewing: false,
        browser: false,
    };

    console.log('-----------login the first time-------------')
    let data = await APIService.login(username, password);
    if(data.errorCode == 1002){
        failReason = data.errorMsg;
        globalEventEmitter.emit('loginFailReason', data.errorMsg);
    }
    let tempdata = data;
    let Res = parseRes(data, 'login', 'LoginV1');
    let hasData = Res.hasData;
    data = Res.data;

    if (hasData && 'success' == data.status) {
        result = true;
        failReason = '';
        // get homeid, sid, frequency after login
        homeid = data.homeid;
        sid = data.sid;
        frequency = parseInt(data.frequency);
        AsyncStorage.setItem('USER_ID', username.toLowerCase());

        if(tempdata && tempdata.userProfile && tempdata.userProfile.profile && tempdata.userProfile.profile.setting) {
            globalTabSwitchState.shop = tempdata.userProfile.profile.setting.shop;
            globalTabSwitchState.location = tempdata.userProfile.profile.setting.location;
            globalTabSwitchState.travel = tempdata.userProfile.profile.setting.travel;
            globalTabSwitchState.social = tempdata.userProfile.profile.setting.social;
            globalTabSwitchState.viewing = tempdata.userProfile.profile.setting.viewing;
            globalTabSwitchState.browser = tempdata.userProfile.profile.setting.browser;
        } else {
            let res = await APIService.updateProfileTabSettings(username.toLowerCase(), tabSwitch);
            console.log(`updateProfileTabSettings -  ${res}`);
        }
    } else {
        console.log('-----------login the second time-------------')
        let data = await APIService.login(username, password);
        let tempdata = data;
        let Res = parseRes(data, 'login', 'LoginV1');
        let hasData = Res.hasData;
        data = Res.data;

        if (hasData && 'success' == data.status) {
            result = true;
            failReason = '';
            // get homeid, sid, frequency after login
            homeid = data.homeid;
            sid = data.sid;
            frequency = parseInt(data.frequency);
            AsyncStorage.setItem('USER_ID',username.toLowerCase());

            if(tempdata && tempdata.userProfile && tempdata.userProfile.profile && tempdata.userProfile.profile.setting) {
                globalTabSwitchState.shop = tempdata.userProfile.profile.setting.shop;
                globalTabSwitchState.location = tempdata.userProfile.profile.setting.location;
                globalTabSwitchState.travel = tempdata.userProfile.profile.setting.travel;
                globalTabSwitchState.social = tempdata.userProfile.profile.setting.social;
                globalTabSwitchState.viewing = tempdata.userProfile.profile.setting.viewing;
                globalTabSwitchState.browser = tempdata.userProfile.profile.setting.browser;
            } else {
                let res = await APIService.updateProfileTabSettings(username.toLowerCase(), tabSwitch);
                console.log(`updateProfileTabSettings -  ${res}`);
            }
        } else {

            console.log('-----------login the third time-------------')
            let data = await APIService.login(username, password);
            let tempdata = data;
            let Res = parseRes(data, 'login', 'LoginV1');
            let hasData = Res.hasData;
            data = Res.data;

            if (hasData && 'success' == data.status) {
                result = true;
                failReason = '';
                // get homeid, sid, frequency after login
                homeid = data.homeid;
                sid = data.sid;
                frequency = parseInt(data.frequency);
                AsyncStorage.setItem('USER_ID',username.toLowerCase());

                if(tempdata && tempdata.userProfile && tempdata.userProfile.profile && tempdata.userProfile.profile.setting) {
                    globalTabSwitchState.shop = tempdata.userProfile.profile.setting.shop;
                    globalTabSwitchState.location = tempdata.userProfile.profile.setting.location;
                    globalTabSwitchState.travel = tempdata.userProfile.profile.setting.travel;
                    globalTabSwitchState.social = tempdata.userProfile.profile.setting.social;
                    globalTabSwitchState.viewing = tempdata.userProfile.profile.setting.viewing;
                    globalTabSwitchState.browser = tempdata.userProfile.profile.setting.browser;
                } else {
                    let res = await APIService.updateProfileTabSettings(username.toLowerCase(), tabSwitch);
                    console.log(`updateProfileTabSettings -  ${res}`);
                }
            } else {

                AsyncStorage.setItem('USER_ID', '');
                console.log('-----------login tried three times-------------')
            }
        }
    }

    return {
        type: 'login',
        payload: {
            hasLogin: result,
            hasLoading: false,
            failReason: failReason,
            homeid: homeid,
            sid: sid,
            frequency: frequency
        }
    };
};



/**
 * login action creator
 * @param {*} username
 * @param {*} password
 */
export const login_getLocals = (username, password) => {
    let result = false;
    let failReason = 'invalid username or password, please try again.';
    let homeid = '';
    let sid = '';
    let frequency = 10;


    return {
        type: 'login',
        payload: {
            hasLogin: result,
            hasLoading: false,
            failReason: failReason,
            homeid: homeid,
            sid: sid,
            frequency: frequency
        }
    };
};



// const maxLoginTimes = 4;
//
// export const login = async(username, password, times) => {
//
//     let result = false;
//     let failReason = 'invalid username or password, please try again.';
//     let homeid = '';
//     let sid = '';
//     let frequency = 10;
//
//     console.log(`----------- login the times : ${times} -------------`)
//
//     let data = await APIService.login(username, password);
//     let Res = parseRes(data, 'login', 'LoginV1');
//     let hasData = Res.hasData;
//     data = Res.data;
//
//     if (hasData && 'success' == data.status) {
//         result = true;
//         failReason = '';
//         // get homeid, sid, frequency after login
//         homeid = data.homeid;
//         sid = data.sid;
//         frequency = parseInt(data.frequency);
//
//     } else {
//         if(times <= maxLoginTimes) {
//             login(username, password, ++times);
//         }
//     }
//
//     return {
//         type: 'login',
//         payload: {
//             hasLogin: result,
//             hasLoading: false,
//             failReason: failReason,
//             homeid: homeid,
//             sid: sid,
//             frequency: frequency
//         }
//     };
// }
