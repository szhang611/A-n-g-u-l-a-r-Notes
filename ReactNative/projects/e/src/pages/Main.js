import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, Button, TouchableOpacity, Image, PanResponder, Switch,
    WebView, ActivityIndicator, AlertIOS, AsyncStorage, ScrollView, AppState, Animated, Dimensions, DeviceEventEmitter
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icons from 'react-native-vector-icons/MaterialIcons'
import DropdownAlert from 'react-native-dropdownalert';
import VersionNumber from 'react-native-version-number';

import { APIService } from '../services/APIService';
import { getContent } from '../actions/ContentActions';
import { switchLiveCategoryVideo, switchRecordedCategoryVideo, setLeftTopVideoMode } from '../actions/CategoryAndVideoSwitchActions';
import { switchComponent, currentHamburgerMarkAt } from '../actions/MainPageActions';
import { logout } from '../actions/LogoutActions';
import { emitUserJoined_action, saveFriendsList, videoReceivedFromFriendShared } from '../actions/InitActions';
import { broadcastSocialMessages, emitSocialMessages, friendsOffiline, friendsOnline,addToVideoQueue, getVideoQueue } from '../actions/SocialActions';

import Header from './Header';
import Favorites from './mainPages/Favorites/Favorites';
import Saved from './mainPages/Saved/Saved';
import Home from './mainPages/Home/Home'
import Recorded from './mainPages/Recorded/Recorded'
import Live from './mainPages/Live/Live'

import SocketIOClient from 'socket.io-client';

import { filterUserAvatar } from '../utils/Util'
import _ from 'lodash'
import { globalEventEmitter, globalTabSwitchState } from '../utils/globalEventEmitter'
import P2PMessage from './mainPages/VideoPlayingParts/middlePages/Social/P2PMessage';

/**
 * Main comoponent of app
 */
class Main extends Component {

    constructor() {
        super();
        this.friendsListScrollOffsetY = 0;
        this.friednsListHeightPercent = 0.5;

        this.onReceivedMessage = this.onReceivedMessage.bind(this);
        this.onFriendsOnline = this.onFriendsOnline.bind(this);
        this.onFriendsOffline = this.onFriendsOffline.bind(this);
        this.onFriendsOnlineList = this.onFriendsOnlineList.bind(this);
        this.shareFromFriends = this.shareFromFriends.bind(this);
        this.onAccpetVideoNotify = this.onAccpetVideoNotify.bind(this);
        this.onRejectVideoNotify = this.onRejectVideoNotify.bind(this);
        this.onWatchingNowNotify = this.onWatchingNowNotify.bind(this);
        this.getAlertByType =  this.getAlertByType.bind(this)

        this.socket = SocketIOClient('http://54.221.14.219:8080');
        // this.socket = SocketIOClient('http://localhost:8080');
        this.socket.on('message', this.onReceivedMessage);
        this.socket.on('online', this.onFriendsOnline);
        this.socket.on('offline', this.onFriendsOffline);
        this.socket.on('onlineList', this.onFriendsOnlineList);
        this.socket.on('shareFromFriends',  this.shareFromFriends);
        this.socket.on('rejectVideoNotify', this.onRejectVideoNotify);
        this.socket.on('acceptVideoNotify', this.onAccpetVideoNotify);
        this.socket.on('wachingNowNotify', this.onWatchingNowNotify);
     }


    ipad = Dimensions.get('window');
    state = {
        isVideoFullScreen: false,
        showLoading: false,
        selectComponent: 'Home',
        showMenuList: false,
        showFriendProfile: false,
        showPortraitList: false,
        showChat: false,
        showMyAccountSubMenu: false,
        tabSwitchState: null,
        currentChatFriend : '', 
        currentDisplayedFriend: '',
        friendsList: [],
        vId:0 ,
        userProfileObj: {
            name: {
                firstName: '',
                lastName: '',
                displayName: ''
            }
        },
        currentAppState: AppState.currentState,
        currentUserId: null,
        hamburgerMenuMarkAt: '',
        unreadMessages: {},
        pan: new Animated.ValueXY(),
        panChat: new Animated.ValueXY(),
        pressPosition: {
            x:0,
            y:0
        },
        highlightAnimatedAvatar: -1,
        userId: '',
    };

    componentWillMount() {
        AsyncStorage.getItem('USER_ID').then((res)=>{

            this.setState({
                friendsList: [{ userId : res, watchingNow: {}, online: true }],
                userId: res,
            },()=>{
                this.props.saveFriendsList(this.state.friendsList);
            });
        });

        console.log(VersionNumber.appVersion);
        console.log(VersionNumber.buildVersion);
        console.log(VersionNumber.bundleIdentifier);

        globalEventEmitter.addListener('startP2PChat', (user) => {
            this.setState (  {showChat : false ,
            } , ( ) => {
                this.setState(
                    {showChat : true ,
                        currentChatFriend : user
                    }
                )
            } )
        })
        this.socket.on('P2PmessageNotify', (senderId, messages1) => {
            // debugger
            if( this.state.unreadMessages[senderId] ){ 
                this.setState((previousState) => {
                    let messages = this.state.unreadMessages
                    messages[senderId] = messages[senderId] + messages1.length
                    return {
                        unreadMessages:  {...messages},
                    };
                    });
            }else{
                this.setState((previousState) => {
                    let messages = this.state.unreadMessages
                    messages[senderId] = 1
                    return {
                        unreadMessages:  {...messages},
                    };
                    });
            }
        })

        globalEventEmitter.addListener('clearUnreadMessages', (userId) => {
            this.setState((previousState) => {
                let messages = this.state.unreadMessages
                messages[userId] = 0
                return {
                    unreadMessages:  {...messages},
                };
                });
        })


        this._animatedPortraitsListPosition = { x:0, y:0 };
        this.state.pan.setValue({x:0, y:0});
        this.state.pan.addListener((value) => {this.handlePortraitsListMovePosition(value)});
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) => {
                this.setState({pressPosition: {
                    x: e.nativeEvent.locationX,
                    y: e.nativeEvent.locationY,
                }});
                return true;
            },
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,

            onPanResponderGrant: (e, gestureState) => {
                this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
                this.state.pan.setValue({x: 0, y: 0});
            },

            onPanResponderMove:(e, gestureState)=>{
                Animated.event([
                    null, {dx: this.state.pan.x, dy: this.state.pan.y},
                ])(e, gestureState)
            },

            onPanResponderRelease: (e, {vx, vy}) => {
                let distance = 0 - this.ipad.height * (16 - 9.1) * 0.01;
                if(this.state.pan.y._offset + this.state.pan.y._value < distance) {
                    let tempX = this.state.pan.x._value;
                    Animated.spring(this.state.pan, {
                        toValue: { x: tempX, y: distance },
                        friction: 20
                    }).start();
                }
                this.state.pan.flattenOffset();

                // emit position to video playing page
                let absoluteX = this.ipad.width + (this._animatedPortraitsListPosition.x - this.ipad.width*0.2);
                let absoluteY = this.ipad.height * (16 - 9.1) * 0.01 + this._animatedPortraitsListPosition.y + 55;      // 9.1%  is the height of Header
                let absolutePosition = {
                    x: Number(absoluteX.toFixed(2)),
                    y: absoluteY - 55 < 0 ? 55 : Number(absoluteY.toFixed(2)),
                    listWidth: this.ipad.width*0.2,
                    listHeight: this.ipad.height*this.friednsListHeightPercent - 55,
                    isShowing: this.state.showPortraitList,
                    scrollOffsetY: this.friendsListScrollOffsetY
                };
                //this.calculateEachFriendPosition(absolutePosition)
                // console.log(absolutePosition);
                globalEventEmitter.emit('AnimatedFriendsListAbsolutePosition', absolutePosition);
                AsyncStorage.setItem('AnimatedFriendsListAbsolutePosition', JSON.stringify(absolutePosition));
                absoluteY = null;
                absolutePosition = null;
            }
        });

        this.state.panChat.setValue({x:0, y:0});
        this.state.panChat.addListener((value) => {});
        this.chatPanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) => {
                this.setState({pressPosition: {
                    x: e.nativeEvent.locationX,
                    y: e.nativeEvent.locationY,
                }});
                return true;
            },
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,

            onPanResponderGrant: (e, gestureState) => {
                this.state.panChat.setOffset({x: this.state.panChat.x._value, y: this.state.panChat.y._value});
                this.state.panChat.setValue({x: 0, y: 0});
            },

            onPanResponderMove:(e, gestureState)=>{
                Animated.event([
                    null, {dx: this.state.panChat.x, dy: this.state.panChat.y},
                ])(e, gestureState)
            },

            onPanResponderRelease: (e, {vx, vy}) => {
                let distance = 0 - this.ipad.height * (16 - 9.1) * 0.01;
                if(this.state.panChat.y._offset + this.state.panChat.y._value < distance) {
                    let tempX = this.state.panChat.x._value;
                    Animated.spring(this.state.panChat, {
                        toValue: { x: tempX, y: distance },
                        friction: 20
                    }).start();
                }
                this.state.panChat.flattenOffset();

                 
            }
        });
        this.resetAnimatedPortraitsListPosition();

        // get tab switch status
        this.initTabSwitchStatus();
        globalEventEmitter.addListener('tabSwitchStatus_OtherEmit', (res)=>{  //  from left bottom or video fullScreen bottom products
            this.setState({tabSwitchState: res});
            AsyncStorage.getItem('USER_ID').then((uid)=>{
                this.updateProfileTabSettings(uid, res);
            });
        })
        globalEventEmitter.addListener('closeTab', (res)=>{  //  from left bottom or video fullScreen bottom products
            this.setState({tabSwitchState: res});
        })
    }

    componentDidMount() {
        DeviceEventEmitter.addListener('didUpdateDimensions', (res) => {  // rotate screen
            console.log(res);
            this.ipad = res.window;
        });

        if(!this.props.init.UserJoined_Emitted) {
            AsyncStorage.getItem('USER_ID').then((_id)=>{
                this.setState({currentUserId: _id});
                this.socket.emit('userJoined', _id);
                this.props.emitUserJoined_action(true);
            })
        }

        AppState.addEventListener('change', this._handleAppStateChange);
        this.props.getVideoQueue();

        globalEventEmitter.addListener('AnimatedFriendsListCurrentHoverAvatar', res => {
            if(res > 0) {
                this.setState({highlightAnimatedAvatar: res});
            } else {
                this.setState({highlightAnimatedAvatar: -1});
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        let init = nextProps.init;
        console.log('Main , init loadingState :' + init.loadingState);
        this.setState({showLoading: init.loadingState});

        // if(this.props.socialMsg.emittedMessage) {
        //     let message = _.cloneDeep(this.props.socialMsg.emittedMessage)
        //     this.props.emitSocialMessages('E3', null);
        //     this.socket.emit('message', message);
        // }

        if(nextProps.hamburgerActions.displayHamburgerMenuList === false) {
            // this.setState({showMenuList: false});
        }
        if(nextProps.hamburgerActions.currentHamburgerMarkAt) {
            this.setState({hamburgerMenuMarkAt: nextProps.hamburgerActions.currentHamburgerMarkAt});
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.resetAnimatedPortraitsListPosition();
    }


    _handleAppStateChange = (nextAppState) => {
        if (this.state.currentAppState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!');
            this.socket.connect();
            AsyncStorage.getItem('USER_ID').then((res)=>{
                this.setState({friendsList:
                    [{ userId : res, watchingNow: {}, online : true }]
                },()=>{
                    this.props.saveFriendsList(this.state.friendsList.filter( (item) => { return item.online}  ));
                });
                this.socket.emit('userJoined', this.state.currentUserId);
            });
        } else {
            console.log('App has come to the background!');
            this.socket.disconnect();
        }
        this.setState({currentAppState: nextAppState});
    };

    onAccpetVideoNotify(userId){
        this.dropdown.alertWithType('info', 'Video Share Accept Notification', " Your Friends " + userId + " has acceptted your video share request.");
    }
    onRejectVideoNotify(userId){
        this.dropdown.alertWithType('warn', 'Video Share Reject Notification', " Your Friends " + userId + " has rejected your video share request.");
    }
    onWatchingNowNotify(userId, content) {
        let idx = _.findIndex(this.state.friendsList, {userId: userId});
        let tempList = this.state.friendsList;
        if(  tempList[idx] ) {
            tempList[idx]['watchingNow'] = content;
            this.setState({friendsList: tempList}, ()=>{
            this.props.saveFriendsList(this.state.friendsList.filter( (item) => { return item.online}  ));
        });
        tempList = null;
        idx = null;
        }
    }

    onFriendsOnline(eventObj) {
        
        this.props.friendsOnline(eventObj);
        let tempList = this.state.friendsList;
        let newList = [];
        for (let idx in tempList) {
            if(tempList[idx].userId == eventObj.username )
                tempList[idx].online = true
                newList.push(tempList[idx]);

        } 
        let selfItem = newList.shift()
        tempList = newList.sort( (item1, item2)=> {
            if (item1.online && !item2.online ){
                return -1
            } 
            if ( !item1.online && item2.online ) {
                return 1
            }
            return 0
        })
        newList = [selfItem, ...newList]
        this.setState({friendsList: newList},()=>{
            this.props.saveFriendsList(this.state.friendsList.filter( (item) => { return item.online}  ));
        });
    }

    onFriendsOffline(eventObj) {
        this.props.friendsOffiline(eventObj);
        let tempList = this.state.friendsList;
        let idx = _.findIndex(tempList, { 'userId': eventObj.user.username});
        if(idx > 0) {
            item = tempList[idx];
            item.online = false;
            item.watchingNow = {};
            let selfItem = tempList.shift();
            tempList = tempList.sort( (item1, item2)=> {
                if (item1.online && !item2.online ){
                    return -1
                } 
                if ( !item1.online && item2.online ) {
                    return 1
                }
                return 0
            });
            tempList = [selfItem, ...tempList];
            this.setState({friendsList: tempList},()=>{
                this.props.saveFriendsList(this.state.friendsList.filter((item) => {
                    return item.online
                }));
            });
        }
    }
    onFriendsOnlineList(eventObj) {

        eventObj = eventObj.sort( (item1, item2)=> {
            if (item1.online && !item2.online ){
                return -1
            } 
            if ( !item1.online && item2.online ) {
                return 1
            }
            return 0
        })
        console.log('onFriendsOnlineList : ' + eventObj);
        let tempList = this.state.friendsList;
        tempList = [...tempList, ...eventObj];
        this.setState({friendsList: tempList},()=>{
            this.props.saveFriendsList(this.state.friendsList.filter( (item) => { return item.online}  ));
        });
    }

    shareFromFriends(userId, content){
        console.log('reciving the video share content from user ', userId);
        Alert.alert(
            'Video Share From '+ userId,
            'You friends invite you to watch the ' + content.contentid + ' ' + content.video.type,
            this.getAlertByType(userId, content),
            { cancelable: false }
          )
    }

    getAlertByType(userId, content){
        if (content.video && content.video.type === 'OTT'){
            return   [
                {text: 'Decline', onPress: ()=> this.socket.emit('rejectVideo', userId), style: 'cancel'},
                {text: 'Accept', onPress:  ()=>  {
                    globalEventEmitter.emit('startWatchLeftBottomVideo', true);
                    this.socket.emit('acceptVideo', userId);
                    this.setState({vId: this.state.vId + 1}, () => this.props.videoReceivedFromFriendShared(content, this.state.vId))  }
                },
                {text: 'Watch it later', onPress: () => { this.props.addToVideoQueue(userId, content) } }
              ]
        }
        return  [
            {text: 'Decline', onPress: ()=> this.socket.emit('rejectVideo', userId), style: 'cancel'},
            {text: 'Accept', onPress:  ()=>  {
                globalEventEmitter.emit('startWatchLeftBottomVideo', true);
                this.socket.emit('acceptVideo', userId);
                this.setState({vId: this.state.vId + 1}, () => this.props.videoReceivedFromFriendShared(content, this.state.vId))  }
            },
          ]

    }

    onReceivedMessage(messages) {
        globalEventEmitter.emit('broadCastSocialMessage', messages )
    }


    logoutFunc() {
        this.socket.emit('watchingNow', this.state.uid, {});
        this.socket.disconnect();
        this.props.emitUserJoined_action(false);
        this.props.logout();
        this.setState({friendsList: []},()=>{
            this.props.saveFriendsList(this.state.friendsList);
        });
        this.setState({hamburgerMenuMarkAt: ''});
        this.props.currentHamburgerMarkAt('', false);
    }


    renderComponentsUnderHeader () {
        switch (this.props.hamburgerActions.hamburgerMenuSelect) {
            case 'Home':
                return <Home />
                break;
            case 'Live':
                return <Live socket = {this.socket}/>
                break;
            case 'Recorded':
                return <Recorded socket = {this.socket}/>
                break;
            case 'WatchVideo':
                return <WatchVideo/>
                break;
            case 'Favorites':
                return <Favorites />
                break;
            case 'Saved':
                return <Saved />
                break;
            default:
                return (
                    <View style={styles.errors}>
                        <Text style={{color: 'red', fontSize: 40}}>ERROR</Text>
                    </View>
                )
        }
    }

    gethamburderMenuState(val) {
        this.setState({showMenuList: val, showMyAccountSubMenu: false});
        this.resetProfilesRelated();
        // console.log(val);
    }
    async getEmittedFriendProfile(val_username) {
        let pro;
        if(val_username !== this.state.currentDisplayedFriend && !this.state.currentDisplayedFriend) {
            this.setState({currentDisplayedFriend: val_username});
            this.setState({showFriendProfile: !this.state.showFriendProfile});
            pro = await APIService.getUserProfileDetails(val_username);
            this.setState({userProfileObj: pro},()=>{pro = null;});
        } else if(val_username !== this.state.currentDisplayedFriend && this.state.currentDisplayedFriend){
            this.setState({currentDisplayedFriend: val_username});
            pro = await APIService.getUserProfileDetails(val_username);
            this.setState({userProfileObj: pro},()=>{pro = null;});
        } else {
            this.setState({currentDisplayedFriend: ''});
            this.setState({showFriendProfile: false});
            pro = null;
        }
        console.log('current clicked user name : ' + val_username);
    }

    getDisplayPortraitListBool(val) {
        this.setState({showPortraitList: !this.state.showPortraitList}, () => {
            // close profile card when user click 'more-horiz' icon
            this.setState({currentDisplayedFriend: ''});
            this.setState({showFriendProfile: false});
            this.state.pan.setValue({x:0, y:0});
            this.resetAnimatedPortraitsListPosition();
        });
    }

    closeProfileCard() {
        this.setState({currentDisplayedFriend: ''});
        this.setState({showFriendProfile: false});
    }

    resetProfilesRelated() {
        this.setState({currentDisplayedFriend: ''});
        this.setState({showFriendProfile: false});
    }

    selectNavItem(name){
        if(name === 'My Account') {
            this.setState({showMyAccountSubMenu: !this.state.showMyAccountSubMenu});
            return;
        }

        if(name){
            this.props.switchComponent(name);
            if(name === 'Recorded') {
                this.props.switchRecordedCategoryVideo('', true);
                this.props.setLeftTopVideoMode('Recorded');
                this.props.switchLiveCategoryVideo('', false);
            } else if(name === 'Live') {
                this.props.switchLiveCategoryVideo('', true);
                this.props.setLeftTopVideoMode('Live');
                this.props.switchRecordedCategoryVideo('', false);
            }
            this.props.videoReceivedFromFriendShared({}, -1);
        }
        this.setState({
            hamburgerMenuMarkAt: name,
            showMenuList: false,
            showMyAccountSubMenu: false
        });
        this.props.currentHamburgerMarkAt(name, false);
    }


    initTabSwitchStatus() {
        this.setState({tabSwitchState: globalTabSwitchState});
    }
    async updateProfileTabSettings(uid , body) {
        console.log(body);
        let res = await APIService.updateProfileTabSettings(uid, body);
        console.log(res);
    }

    setSwitchValue(option, val){
        globalTabSwitchState[option] = val;
        globalEventEmitter.emit('tabSwitchStatus_MainEmit', globalTabSwitchState);
        this.setState({tabSwitchState: globalTabSwitchState});
        this.updateProfileTabSettings(this.state.userId, globalTabSwitchState);
    }

    renderMenuList() {
        return (
            <View style={styles.menuView}>
                <TouchableOpacity style={{flex:1}} onPress={()=>{this.setState({showMenuList: false, showMyAccountSubMenu: false});}} />
                <View style={{flex:10, flexDirection: 'row'}}>
                    <View style={styles.menuContainer}>
                        <View style={styles.menuContainerInner}>
                            <TouchableOpacity style={styles.menuListItem} onPress={()=>{this.selectNavItem('My Account')}}>
                                { this.state.hamburgerMenuMarkAt === 'My Account' && <Icons style={styles.menuListItemMark} name={'star'} color={'#FFFFFF'} size={14}/>}
                                <Text style={styles.menuListItemText}>My Account</Text>
                            </TouchableOpacity>

                            <Text style={{color: '#FFFFFF', marginLeft: 10, marginRight: 10}}>------------------------</Text>

                            <TouchableOpacity style={styles.menuListItem} onPress={()=>{this.selectNavItem('Favorites')}}>
                                { this.state.hamburgerMenuMarkAt === 'Favorites' && <Icons style={styles.menuListItemMark} name={'star'} color={'#FFFFFF'} size={14}/>}
                                <Text style={styles.menuListItemText}>Favorites</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuListItem} onPress={()=>{this.selectNavItem('Live')}}>
                                { this.state.hamburgerMenuMarkAt === 'Live' && <Icons style={styles.menuListItemMark} name={'star'} color={'#FFFFFF'} size={14}/>}
                                <Text style={styles.menuListItemText}>Live</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuListItem} onPress={()=>{this.selectNavItem('Saved')}}>
                                { this.state.hamburgerMenuMarkAt === 'Saved' && <Icons style={styles.menuListItemMark} name={'star'} color={'#FFFFFF'} size={14}/>}
                                <Text style={styles.menuListItemText}>Saved</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuListItem} onPress={()=>{this.selectNavItem('')}}>
                                { this.state.hamburgerMenuMarkAt === 'Messages' && <Icons style={styles.menuListItemMark} name={'star'} color={'#FFFFFF'} size={14}/>}
                                <Text style={styles.menuListItemText}>Messages</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuListItem} onPress={()=>{this.selectNavItem('')}}>
                                { this.state.hamburgerMenuMarkAt === 'Scheduled' && <Icons style={styles.menuListItemMark} name={'star'} color={'#FFFFFF'} size={14}/>}
                                <Text style={styles.menuListItemText}>Scheduled</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuListItem} onPress={()=>{this.selectNavItem('Recorded')}}>
                                { this.state.hamburgerMenuMarkAt === 'Recorded' && <Icons style={styles.menuListItemMark} name={'star'} color={'#FFFFFF'} size={14}/>}
                                <Text style={styles.menuListItemText}>Recorded</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuListItem} onPress={()=>{this.selectNavItem('')}}>
                                { this.state.hamburgerMenuMarkAt === 'Recommendations' && <Icons style={styles.menuListItemMark} name={'star'} color={'#FFFFFF'} size={14}/>}
                                <Text style={styles.menuListItemText}>Recommendations</Text>
                            </TouchableOpacity>

                            <Text style={{color: '#FFFFFF', marginLeft: 10}}>------------------------</Text>

                            <TouchableOpacity style={styles.menuListItem} onPress={()=>{this.selectNavItem('')}}>
                                { this.state.hamburgerMenuMarkAt === 'Open Shop' && <Icons style={styles.menuListItemMark} name={'star'} color={'#FFFFFF'} size={14}/>}
                                <Text style={styles.menuListItemText}>Open Shop</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuListItem} onPress={()=>{this.selectNavItem('')}}>
                                { this.state.hamburgerMenuMarkAt === 'Close Shop' && <Icons style={styles.menuListItemMark} name={'star'} color={'#FFFFFF'} size={14}/>}
                                <Text style={styles.menuListItemText}>Close Shop</Text>
                            </TouchableOpacity>

                            <Text style={{color: '#FFFFFF', marginLeft: 10}}>------------------------</Text>

                            <TouchableOpacity style={[styles.menuListItem, {marginBottom: 14,}]} onPress={()=>{this.logoutFunc()}}>
                                <Text style={styles.menuListItemText}>Logout</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={{height: 10000, backgroundColor: 'transparent'}}  onPress={()=>{this.setState({showMenuList: false,showMyAccountSubMenu: false});}}/>
                    </View>

                    {
                        this.state.showMyAccountSubMenu && this.renderMyAccountSubMenu()
                    }

                    <TouchableOpacity style={styles.menuRightBlank} onPress={()=>{this.setState({showMenuList: false,showMyAccountSubMenu: false});}} />

                </View>
            </View>
        )
    }

    renderMyAccountSubMenu() {
        return (
            <View style={styles.myAccountSubMenu}>
                <View style={styles.myAccountSubMenuInner}>
                    <View style={styles.menuListItem}>
                        <Text style={styles.menuListItemText}>Settings</Text>
                    </View>

                    <Text style={{color: '#FFFFFF', marginLeft: 10, marginRight: 10,}}>------------------------</Text>

                    <View style={styles.myAccountSubMenuListItem}>
                        <Text style={styles.myAccountSubMenuListItemText}>SHOP</Text>
                        <Switch style={styles.myAccountSubMenuSwitch}
                                onValueChange={(value)=>{this.setSwitchValue('shop', value)}}
                                value={this.state.tabSwitchState.shop}
                        />
                    </View>
                    <View style={styles.myAccountSubMenuListItem}>
                        <Text style={styles.myAccountSubMenuListItemText}>LOCATION</Text>
                        <Switch style={styles.myAccountSubMenuSwitch}
                                onValueChange={(value)=>{this.setSwitchValue('location', value)}}
                                value={this.state.tabSwitchState.location}
                        />
                    </View>
                    <View style={styles.myAccountSubMenuListItem}>
                        <Text style={styles.myAccountSubMenuListItemText}>TRAVEL</Text>
                        <Switch style={styles.myAccountSubMenuSwitch}
                                onValueChange={(value)=>{this.setSwitchValue('travel', value)}}
                                value={this.state.tabSwitchState.travel}
                        />
                    </View>
                    <View style={styles.myAccountSubMenuListItem}>
                        <Text style={styles.myAccountSubMenuListItemText}>SOCIAL</Text>
                        <Switch style={styles.myAccountSubMenuSwitch}
                                onValueChange={(value)=>{this.setSwitchValue('social', value)}}
                                value={this.state.tabSwitchState.social}
                        />
                    </View>
                    <View style={styles.myAccountSubMenuListItem}>
                        <Text style={styles.myAccountSubMenuListItemText}>VIEWING</Text>
                        <Switch style={styles.myAccountSubMenuSwitch}
                                onValueChange={(value)=>{this.setSwitchValue('viewing', value)}}
                                value={this.state.tabSwitchState.viewing}
                        />
                    </View>
                    <View style={styles.myAccountSubMenuListItem}>
                        <Text style={styles.myAccountSubMenuListItemText}>INTERNET</Text>
                        <Switch style={styles.myAccountSubMenuSwitch}
                                onValueChange={(value)=>{this.setSwitchValue('browser', value)}}
                                value={this.state.tabSwitchState.browser}
                        />
                    </View>
                </View>

                <TouchableOpacity style={{height: 10000, backgroundColor: 'transparent'}}  onPress={()=>{this.setState({showMenuList: false,showMyAccountSubMenu: false});}}/>
            </View>
        )
    }

    renderHeaderMask() {
        return(
            <TouchableOpacity style={styles.headerMask} onPress={()=>{this.resetProfilesRelated()}} />
        )
    }

    handlePortraitsListMovePosition(val) {
        // console.log(val);
        this._animatedPortraitsListPosition = val;
    }
    closeAnimatedPortraitsList(){
        this.setState({showPortraitList: false},()=>{
            this.resetAnimatedPortraitsListPosition();
        });
        this.state.pan.setValue({x:0, y:0});
    }

    closeAnimatedChatView(){
        this.setState({showChat: false});
        this.state.panChat.setValue({x:0, y:0}); 
    }

    resetAnimatedPortraitsListPosition() {
        let x = this.ipad.width*(1-0.2);
        let y = this.ipad.height*(16-9.1)*0.01 + 55; //55 is the height of list title
        let initPosition = {
            x: x,
            y: Number(y.toFixed(2)),
            listWidth: this.ipad.width*0.2,
            listHeight: this.ipad.height*this.friednsListHeightPercent - 55,
            isShowing: this.state.showPortraitList,
            scrollOffsetY: this.friendsListScrollOffsetY
        };
        globalEventEmitter.emit('AnimatedFriendsListAbsolutePosition', initPosition);
        AsyncStorage.setItem('AnimatedFriendsListAbsolutePosition', JSON.stringify(initPosition));
        y = null;
    }

    friendsListOnScroll(event){
        this.friendsListScrollOffsetY = event.nativeEvent.contentOffset.y;

        AsyncStorage.getItem('AnimatedFriendsListAbsolutePosition').then((resPosi)=>{
            let postion = {...JSON.parse(resPosi), scrollOffsetY: this.friendsListScrollOffsetY};
            globalEventEmitter.emit('AnimatedFriendsListAbsolutePosition', postion);
            AsyncStorage.setItem('AnimatedFriendsListAbsolutePosition', JSON.stringify(postion));
        });
    };

    renderAnimatedPortraitList() {
        let { pan } = this.state;
        let [translateX, translateY] = [pan.x, pan.y];
        let animatedPortraitStyle = {transform: [{translateX}, {translateY}]};
        return (
            <Animated.View style={[animatedPortraitStyle, styles.AnimatedProtraitList, this.state.fullScreen? styles.LeftTopfulScreen : styles.leftTopAnimatedView]}>
                <View style={styles.portraitListView}>
                    <Animated.View style={styles.portraitListViewTitle}  {...this.panResponder.panHandlers}>
                        <Text style={[styles.portraitListViewTitleText, commonStyles.FontWeight_bold]}>Friends</Text>
                        <TouchableOpacity style={styles.animatedPortraitListCloseIcon} onPress={()=>{this.closeAnimatedPortraitsList()}}>
                            <Icons name={'close'} color={'#FFFFFF'} size={20}/>
                        </TouchableOpacity>
                    </Animated.View>
                    <ScrollView onScroll={(event)=>this.friendsListOnScroll(event)} scrollEventThrottle={100}>
                        {
                            this.renderPortraitsList()
                        }
                    </ScrollView>
                </View>
            </Animated.View>
        )
    }

    renderAnimatedChat() {
        let { panChat } = this.state;
        let [translateX, translateY] = [panChat.x, panChat.y];
        let animatedChatStyle = {transform: [{translateX}, {translateY}]};
        return (
            <Animated.View style={[animatedChatStyle, styles.AnimatedChatWindow, this.state.fullScreen? styles.LeftTopfulScreen : styles.leftTopAnimatedView]}>
                <View style={styles.chatView}>
                    <Animated.View style={styles.chatViewTitle} {...this.chatPanResponder.panHandlers}>
                        <Text style={[styles.portraitListViewTitleText, commonStyles.FontWeight_bold]}>Chat with {this.state.currentChatFriend.userId}</Text>
                        <TouchableOpacity style={styles.animatedPortraitListCloseIcon} onPress={()=>{this.closeAnimatedChatView()}}>
                            <Icons name={'close'} color={'#FFFFFF'} size={20}/>
                        </TouchableOpacity>
                    </Animated.View>
                    <View style= {{flex : 1, backgroundColor: '#111'}}>
                        {
                            this.renderP2PChat()
                        }
                    </View>
                </View>
            </Animated.View>
        )
    }

    renderP2PChat(){

        return (<P2PMessage socket = {this.socket}  receiver = { this.state.currentChatFriend  } user = { this.state.currentUserId }/>)
    }
    renderMessageCounter(item){
        if(this.state.unreadMessages[item.userId] === 0 || this.state.unreadMessages[item.userId] === undefined ){
            return ;
        }
        return ( <View style = {{backgroundColor:'red', position:'absolute', zIndex : 4,  justifyContent: 'flex-end',  width: 20, height: 20, right:-5 , top: -5 , overflow: "hidden",borderRadius: 10 , borderColor: '#fff'}}>
                                <Text style ={{ color : '#fff', fontWeight:'900', justifyContent: 'center', alignItems :'center', width: 20, height: 20, left : 2}}> {this.state.unreadMessages[item.userId]} </Text> 
                           </View>) 
    }
    renderPortraitsList(){
        if(this.state.friendsList.length>0){
            console.log(this.state.friendsList);
            return this.state.friendsList.map((item, idx)=>{
                return (
                    <TouchableOpacity key={idx} style={styles.protraitsListItemGroup} onPress={()=>{ item.userId !== this.state.currentUserId  && globalEventEmitter.emit('startP2PChat', item)  }}>
                        <View style= {{ flex : 1, flexDirection :'row' ,position: 'relative'}}> 
                           { this.renderMessageCounter(item)}
                            <View style= {{ position: 'relative'}}>
                            <Image style={[styles.portraitListItemImage, this.state.highlightAnimatedAvatar === idx? styles.highlightAnimatedAvatar_ : {}  ]}
                                resizeMode='cover' source={{uri: filterUserAvatar(item.userId)}}
                                defaultSource={require( '../assets/logo/default_portrait.png')}
                            />
                            {
                                !item.online && item.userId !== this.state.currentUserId &&  <View style = {{ backgroundColor : '#000', opacity : 0.55 , top : 0, width : 40, height: 40, left:0 , position: 'absolute', zIndex : 122}}>

                                </View>
                            
                            }
                            </View>
                            
                            
                        </View>
                         <View style={styles.portraitListNameTextWrapper}>
                            <Text style={[styles.portraitListNameText, commonStyles.FontWeight_bold]} numberOfLines={1}>{item.userId } </Text>
                            {
                                
                                item.watchingNow && item.watchingNow.contentid &&
                                <Text style={styles.portraitListNameText} numberOfLines={1}>Watching: <Text>{item.watchingNow.contentid}</Text></Text>
                            }
                            {
                                 !item.online && item.userId !== this.state.currentUserId  &&  <Text style={[styles.portraitListNameText, commonStyles.FontWeight_bold]} numberOfLines={1}> [offline] </Text>
                            }
                        </View>
                    </TouchableOpacity>
                )
            })
        }
    }

    async viewPortraitFromList(friendName) {
        this.setState({currentDisplayedFriend: friendName});
        this.setState({showFriendProfile: true});
        if(friendName) {
            let pro = await APIService.getUserProfileDetails(friendName);
            this.setState({userProfileObj: pro});
            current_user =  await AsyncStorage.getItem('USER_ID')
            // if(current_user !== friendName){
            //     globalEventEmitter.emit('P2PMessage', pro)
            // }
            
        }
    }

    render() {
        return (
            <View style={styles.mainContainer}>

                <Header style={styles.header}
                    emitToggleHamburger={this.gethamburderMenuState.bind(this)}
                    emitToggleFriendProfile={this.getEmittedFriendProfile.bind(this)}
                    emitDisplayPortraitList={this.getDisplayPortraitListBool.bind(this)}
                    friendsList={this.state.friendsList.filter((item)=>{  return item.online})}
                    showPortraitList={this.state.showPortraitList}
                    unreadMessages = {this.state.unreadMessages}
                />

                <View style={styles.body}>
                    {this.renderComponentsUnderHeader()}
                </View>


                {
                    this.state.showLoading &&
                    <View style={{position:'absolute',top:'10%',left: 0, zIndex:10001, height:'100%',width:'100%',}}>
                        <View style={{ justifyContent: 'center', alignItems:'center',width: 300,height: 100,top: '38%',left:'35%',zIndex: 10005,}}>
                            <Text style={{color:'#FFFFFF', fontSize: 40, backgroundColor:'transparent', }}>
                                Loading Data ...
                            </Text>
                        </View>
                    </View>
                }

                {
                    this.state.showMenuList && this.renderMenuList()
                }

                {
                    (this.state.showFriendProfile || this.state.showPortraitList) && this.renderHeaderMask()
                }

                {
                    this.state.showPortraitList && this.renderAnimatedPortraitList()
                }

                {
                    this.state.showChat && this.renderAnimatedChat()
                }

                <DropdownAlert ref={ref => this.dropdown = ref}  zIndex = {4}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#282828',
        position: 'relative',
    },
    header: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        zIndex: 3,
        backgroundColor: '#282828',
    },
    body: {
        flex: 10,
        backgroundColor: 'black',
        width: '100%',
        flexDirection: 'row'
    },
    errors: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    menuView: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 124,
        flex: 1,
        // backgroundColor: '#f82',
    },
    menuContainer:{
        // backgroundColor:'#000',
        // width: 200,
    },
    menuContainerInner: {
        backgroundColor: '#000',
        borderRightWidth: 1,
        borderRightColor: '#888',
        borderBottomWidth: 1,
        borderBottomColor: '#888',
        borderTopWidth: 1,
        borderTopColor: '#888'
    },
    menuListItem:{
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 15,
        position: 'relative',
    },
    menuListItemMark: {
        position: 'absolute',
        top: 5,
        left: 0,
    },
    menuListItemText:{
        color: '#FFFFFF',
        fontSize: 14,
    },
    myAccountSubMenu: {
        // width: 150,
        // height: 150,
    },
    myAccountSubMenuInner: {
        backgroundColor: '#000',
        borderRightWidth: 1,
        borderRightColor: '#888',
        borderBottomWidth: 1,
        borderBottomColor: '#888',
        borderTopWidth: 1,
        borderTopColor: '#888',
    },
    myAccountSubMenuListItem: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    myAccountSubMenuListItemText:{
        color: '#FFFFFF',
        fontSize: 14,
        lineHeight: 32,
    },
    myAccountSubMenuSwitch: {
        transform: [
            { scaleX: .8 },
            { scaleY: .8 }
        ],
        marginRight: 5,
    },
    menuRightBlank: {
        width: '100%',
        height: '100%',
        flex: 4,
    },
    friendProfileView: {
        position: 'absolute',
        top: '9.1%',
        right: 0,
        width: '60%',
        height: '100%',
        zIndex: 123,
        // flex: 1,
    },
    headerMask: {
        position: 'absolute',
        left: '8.3%',
        top: 0,
        width: '67%',
        height: '9.1%',
        backgroundColor: 'transparent',
        zIndex: 123,
    },
    friendProfileLeftBlank: {
        backgroundColor: 'transparent',
    },
    profileCardWrapper: {
        // flex: 4,
        width: '66%',
        position: 'relative',
    },
    portraitListView: {
        // flex: 2,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: '#999',
    },
    chatView: {
        // flex: 2,
        width: '100%',
         height: '100%',
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: '#999',
    },
    profileContainer: {

    },
    profileCardInnerArea: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#000',
        height: '100%',
        width: '100%',
    },
    profileAreaLeft: {
        flex: 3,
    },
    profileAreaRight: {
        flex: 5,
    },
    blankUnderProfile: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    closeProfileCardIconWrapper: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: 50,
        height: 50,
        zIndex: 130,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    closeProfileCardIcon: {

    },
    userNameInProfile: {
        color: '#FFF',
        fontSize: 12,
        height: 28,
        lineHeight: 28,
        marginLeft: 20,
    },
    userAvatarInProfile: {
        width: 100,
        height: 100,
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    protraitsListItemGroup: {
        flexDirection: 'row',
        margin: 5,
        backgroundColor: 'transparent',
    },
    chatListItemImage: {
        flex: 1,
        width: 40,
        height: 40,
    },
    portraitListItemImage: {
        flex: 1,
        width: 40,
        height: 40,
    },
    portraitListNameTextWrapper: {
        flex: 4,
        paddingLeft: 5,
    },
    portraitListNameText: {
        color: '#FFF',
        fontSize: 12,
        flex:1,
    },
    chatViewTitle: {
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        borderBottomColor: '#666',
        borderBottomWidth: 1,
        position: 'relative',
    },
    portraitListViewTitle: {
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        borderBottomColor: '#666',
        borderBottomWidth: 1,
        position: 'relative',
    },
    portraitListViewTitleText: {
        fontSize: 14,
        color: '#FFF',
    },

    AnimatedProtraitList: {
        position: 'absolute',
        top: '16%',
        right: 0,
        width: '20%',
        height: '50%',  // this.friednsListHeightPercent
        zIndex: 16,
    },
    AnimatedChatWindow: {
        position: 'absolute',
        top: '20%',
        left: '35%',
        width: '42%',
        height: '60%',
        zIndex: 15,
    },
    animatedPortraitListCloseIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: 50,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },

    highlightAnimatedAvatar_: {
        borderWidth: 1,
        borderColor: '#48ff42',
    }
});


const commonStyles = StyleSheet.create({
    FontWeight_bold: {
        fontWeight: 'bold',
    },
    Flex3: {
        flex: 3
    },
    Flex5: {
        flex: 5
    },
    Flex7: {
        flex: 7
    },
});


//---------------    container    -----------------
const mapStateToProps = state => ({
    selectedTab: state.selectedTab, //default: 'global'
    app: state.app,
    init: state.init,
    hamburgerActions: state.hamburgerActions,
    socialMsg: state.socialMsg,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        logout, getContent, switchComponent, switchLiveCategoryVideo, switchRecordedCategoryVideo, setLeftTopVideoMode,
        broadcastSocialMessages, emitSocialMessages, friendsOnline, friendsOffiline, emitUserJoined_action, saveFriendsList, videoReceivedFromFriendShared,
        currentHamburgerMarkAt,getVideoQueue,addToVideoQueue
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(Main);
