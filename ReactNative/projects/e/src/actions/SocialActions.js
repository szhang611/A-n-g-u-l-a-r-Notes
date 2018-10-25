/**
 * Send Social Messages
 * @param {*} socialType, messages
 */
import SocketIOClient from 'socket.io-client';
import {APIService} from '../services/APIService'
import {AsyncStorage} from 'react-native'
export const sendSocialMessages = (socialType, messages) => {
    return {
        type: 'sendSocialMessages',
        payload: {
            socialType,
            messages
        }
    }
};

export const jointChatRoom = (socket, userId, watching_now)=>{
    watching_now = Object.assign( {}, watching_now, {userId} )
     socket.emit('joinChatRoom', watching_now);
     return {
        type: 'jointChatRoom',
        payload: {
            socialType : 'E3',
            watching_now
        }
    }
};

export const onlineUsersImageRange = (imageRange)=> {
    return {
        type: 'imageRange',
        payload: {
            socialType : 'E3',
            imageRange
        }
    }

};

export const addToVideoQueue = async (userId, content)=> {
    let currentUserId = await AsyncStorage.getItem('USER_ID');
    await APIService.addShareRequest(currentUserId, userId, content).catch(reason => {
         console.error(reason)
    }); 
    let videoQueueItems = await APIService.getShareRequests(currentUserId).catch(reason => {
        console.error(reason)
   });
   // debugger
    return {
        type: 'videoQueue',
        payload: {
            videoQueueItems
        }
    }

};

export const removeShareRequest = async ( id)=> {
    let currentUserId = await AsyncStorage.getItem('USER_ID');
    await APIService.removeShareRequest(currentUserId, id).catch(reason => {
         console.error(reason)
    }); 
    let videoQueueItems = await APIService.getShareRequests(currentUserId).catch(reason => {
        console.error(reason)
    });
    return {
        type: 'videoQueue',
        payload: {
            videoQueueItems
        }
    }

};

export const getVideoQueue = async ()=> {

    let currentUserId = await AsyncStorage.getItem('USER_ID');
    let videoQueueItems = await APIService.getShareRequests(currentUserId).catch(reason => {
        console.error(reason)
   }); 
    return {
        type: 'videoQueue',
        payload: {
            videoQueueItems
        }
    }

};

export const shareVideo = (userId, videoContent, vId) =>{
    return {
        type: 'shareVideo',
        payload: {
            shareVideoContent : {
                userId,
                'content' : videoContent,
                vId
            }
        }
    }
}


export const emitSocialMessages = (socket, socialType, emittedMessage) => {

    socket.emit('message', emittedMessage);
    return {
        type: 'emitSocialMessages',
        payload: {
            socialType,
            emittedMessage
        }
    }
};

export const emitP2PMessages = (socket, emittedMessage, receiver) => {

    socket.emit('P2PMessage', emittedMessage, receiver.userId);
    return {    
        type: 'P2PMessage',
        payload: {
            emittedMessage
        }
    }
};

export const broadcastSocialMessages = (socialType, broadcastMessage, vId) => {
    return {
        type: 'broadcastSocialMessages',
        payload: {
            socialType,
            broadcastMessage : {
                'messages' : broadcastMessage,
                vId
            }
        }
    }
};

export const friendsOffiline = (offlineUser) => {
    return {
        type: 'friendsOffiline',
        payload: {
            offlineUser
        }
    }
};

export const friendsOnline = (onlineUser) => {
    return {
        type: 'friendsOnline',
        payload: {
            onlineUser
        }
    }
};

