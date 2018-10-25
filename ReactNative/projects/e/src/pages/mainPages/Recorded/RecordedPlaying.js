import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, AlertIOS, Image, ScrollView, Animated, PanResponder, Dimensions, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icons from 'react-native-vector-icons/MaterialIcons'
import Slider from 'react-native-slider';

import LeftTop from '../VideoPlayingParts/LeftTop';
import LeftBottom from '../VideoPlayingParts/LeftBottom';
import LeftBottomVideo from './LeftBottomVideo';
import ViewingVideo from '../VideoPlayingParts/middlePages/Viewing/ViewingVideo';
import Middle from '../VideoPlayingParts/Middle';

import AllUrls from '../../../services/APIUrl';
import { emitMoveOnAvatar, videoReceivedFromFriendShared } from '../../../actions/InitActions';
import { setLeftTopVideoMode, switchLiveCategoryVideo } from '../../../actions/CategoryAndVideoSwitchActions';
import { switchComponent, currentHamburgerMarkAt } from '../../../actions/MainPageActions';
import { navigateTo } from '../../../actions/NavigationAction';
import { addToVideoQueue, getVideoQueue } from '../../../actions/SocialActions';

import { globalEventEmitter, globalTabSwitchState } from '../../../utils/globalEventEmitter';
import urls from '../../../services/APIUrl';
import { toHHMMSS } from "../../../utils/Util";
import VideoClipPlayer from '../../../utils/video-clip/index';
import { APIService } from '../../../services/APIService';



class RecordedWatching extends Component {
    constructor() {
        super();
        this.currentAvatar = 0;
        this.headerHeight = 0;
        this.currentAnimatedListAvatar = -1;
        this.currentClipVideoTime = 0;
    }

    state = {
        userId: '',
        fullScreen: true,
        pan: new Animated.ValueXY(),
        pan_bottomVideo: new Animated.ValueXY(),
        pan_viewingVideo: new Animated.ValueXY(),
        pan_clipVideo: new Animated.ValueXY(),
        ipad: Dimensions.get('window'),
        pressPosition: {
            x:0,
            y:0
        },
        pushId: -1,
        pressPosition_BotttomVideo: {
            x:0,
            y:0
        },
        pressPosition_ViewingVideo: {
            x:0,
            y:0
        },
        pressPosition_ClipVideo: {
            x:0,
            y:0
        },
        avatarsSize: null,
        primaryVideoCovered: false,
        removeSecondVideo: false,
        removeViewingVideo: false,
        OttOffset: 0,
        OttOffset_leftBottom: 0,
        primaryVideoHeight: 0,
        primaryVideoWidth: 0 ,
        videoContent_ReceivedFromFriendShared: {},

        AnimatedFriendsListAbsolutePosition: {},
        showViewingVideo: false,
        viewingVideoContent: null,
        viewingVideoHeight: 0,


        showVideoEditor: false,
        videoEditorStartValue: 0,
        videoEditorDurationValue: 1,
        wholeVideoDuration: 0,
        clipStartTime : 0,
        clipDurationTime: 0,
        displaySavedVideo: false,
        displayReplayButton: false,
        clipVideoPlayToDurationEnd: false,

    };


    componentWillMount() {
        AsyncStorage.getItem('USER_ID').then((uid)=>{this.setState({userId: uid})});
        // ----drag video---start-----------------
        // Add a listener for the delta value change
        this._val = { x:0, y:0 };
        this.state.pan.setValue({x:0, y:0});
        this.state.pan.addListener((value) => {
            this.handleVideoMovePosition(value, 'LeftTop');
            this.handleVideoMovePosition_AnimatedFriendsList(value, 'LeftTop');
        });
        // Initialize PanResponder with move handling
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) => {
                console.log('locationX :' + e.nativeEvent.locationX);
                console.log('locationY :' + e.nativeEvent.locationY);
                this.setState({pressPosition: {
                    x: e.nativeEvent.locationX,
                    y: e.nativeEvent.locationY,
                }});
                return true;
            },
            onPanResponderMove: Animated.event([
                null, { dx: this.state.pan.x, dy: this.state.pan.y }
            ]),
            onPanResponderRelease: (e, gesture) => {
                Animated.spring(this.state.pan, {
                    toValue: { x: 0, y: 0 },
                    friction: 30
                }).start();
                // console.log(this.currentAvatar);
                if(this.currentAvatar>0){
                    let listLength = this.props.init.saved_friends_list.length;
                    if(this.props.init.saved_friends_list.length > 3) {
                        listLength = 3;
                    }
                    let difff = listLength - this.currentAvatar;
                    if(difff > 0){
                        this.shareToPopupAlert(this.props.init.saved_friends_list[difff].userId, this.props.init.contentid);
                    }
                }
                this.currentAvatar = 0;
                this.props.emitMoveOnAvatar(0);


                /* emit animated avatar when release video */
                if(this.currentAnimatedListAvatar > 0) {
                    this.shareToPopupAlert(this.props.init.saved_friends_list[this.currentAnimatedListAvatar].userId, this.props.init.contentid);
                }

            },
        });


        this.state.pan_bottomVideo.setValue({x:0, y:0});
        this.state.pan_bottomVideo.addListener((value) => {
            this.handleVideoMovePosition(value, 'LeftBottomVideo');
            this.handleVideoMovePosition_AnimatedFriendsList(value, 'LeftBottomVideo');
        });
        this.panResponder_bottomVideo = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) =>  {
                console.log('locationX :' + e.nativeEvent.locationX);
                console.log('locationY :' + e.nativeEvent.locationY);
                this.setState({pressPosition_BotttomVideo: {
                    x: e.nativeEvent.locationX,
                    y: e.nativeEvent.locationY,
                }});
                return true;
            },
            onPanResponderMove: Animated.event([
                null, { dx: this.state.pan_bottomVideo.x, dy: this.state.pan_bottomVideo.y }
            ]),
            onPanResponderRelease: (e, gesture) => {


                if (this.state.removeSecondVideo){
                    console.log("inside remove ")
                    this.setState({
                        removeSecondVideo: false
                    }, ()=>{
                        this.closeBottomVideo()
                    });

                    return
                }
                else if (this.state.primaryVideoCovered){
                    this.setState({
                        primaryVideoCovered: false
                    }, ()=>{
                        Alert.alert(
                            'Do you want to save the primary video?',
                            '',
                            [
                                {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
                                {text: 'Yes', onPress: () => {
                                    //save current primary video to queue
                                    this.props.addToVideoQueue(this.state.userId, {
                                        contentid: this.props.init.contentid,
                                        video: {
                                            type: 'OTT',
                                            offset: this.state.OttOffset,
                                            url: AllUrls.videoUri(this.props.init.contentid)
                                        }
                                    });

                                    // 1. goingToReplace the video uri , and seek to where it was playing
                                    globalEventEmitter.emit('replaceLeftTopVideoByLeftBottomShared', this.state.videoContent_ReceivedFromFriendShared);
                                    this.props.videoReceivedFromFriendShared({}, -1);

                                    // 2. close the secondary video player.
                                    this.closeBottomVideo();
                                }},
                            ],
                            { cancelable: false }
                        );
                    })
                }else{
                    // handle the share senario
                    console.log(this.currentAvatar);
                    if(this.currentAvatar>0){
                        let listLength = this.props.init.saved_friends_list.length;
                        if(this.props.init.saved_friends_list.length > 3) {
                            listLength = 3;
                        }
                        let difff = listLength - this.currentAvatar;
                        if(difff > 0){
                            this.shareToPopupAlert(this.props.init.saved_friends_list[difff].userId, this.state.videoContent_ReceivedFromFriendShared.contentid);
                        }
                    }

                }
                this.currentAvatar = 0;
                this.props.emitMoveOnAvatar(0);
                Animated.spring(this.state.pan_bottomVideo, {
                    toValue: { x: 0, y: 0 },
                    friction: 30
                }).start();


                /* emit animated avatar when release video */
                if(this.currentAnimatedListAvatar > 0) {
                    this.shareToPopupAlert(this.props.init.saved_friends_list[this.currentAnimatedListAvatar].userId, this.state.videoContent_ReceivedFromFriendShared.contentid);
                }

            },
        });



        // ------ drag viewingVideo part start ------
        this.state.pan_viewingVideo.setValue({x:0, y:0});
        this.state.pan_viewingVideo.addListener((value) => {
            this.handleVideoMovePosition(value, 'ViewingVideo');
            // this.handleVideoMovePosition_AnimatedFriendsList(value, 'ViewingVideo');
        });
        this.panResponder_viewingVideo = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) =>  {
                console.log('locationX :' + e.nativeEvent.locationX);
                console.log('locationY :' + e.nativeEvent.locationY);
                this.setState({pressPosition_ViewingVideo: {
                    x: e.nativeEvent.locationX,
                    y: e.nativeEvent.locationY,
                }});
                return true;
            },
            onPanResponderMove: Animated.event([
                null, { dx: this.state.pan_viewingVideo.x, dy: this.state.pan_viewingVideo.y }
            ]),
            onPanResponderRelease: (e, gesture) => {
                if (this.state.removeViewingVideo){
                    console.log("inside remove ")
                    this.setState({
                        removeViewingVideo: false
                    }, ()=>{
                        this.closeViewingVideo();
                    });
                    return;
                } else if (this.state.primaryVideoCovered){
                    this.setState({
                        primaryVideoCovered: false
                    }, ()=>{
                        Alert.alert(
                            'Do you want to save the primary video?',
                            '',
                            [
                                {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
                                {text: 'Yes', onPress: () => {
                                    //save current primary video to queue
                                    this.props.addToVideoQueue(this.state.userId, {
                                        contentid: this.props.init.contentid,
                                        video: {
                                            type: 'OTT',
                                            offset: this.state.OttOffset,
                                            url: AllUrls.videoUri(this.props.init.contentid)
                                        }
                                    });

                                    // 1. goingToReplace the video uri , and seek to where it was playing
                                    globalEventEmitter.emit('replaceLeftTopVideoByLeftBottomShared', this.state.viewingVideoContent);

                                    // 2. close the viewing video player.
                                    globalEventEmitter.emit('endViewingVideo', null);
                                    this.state.pan_viewingVideo.setValue({x:0, y:0});
                                }},
                            ],
                            { cancelable: false }
                        );
                    })
                }
                Animated.spring(this.state.pan_viewingVideo, {
                    toValue: { x: 0, y: 0 },
                    friction: 30
                }).start();
            },
        });
        // ------ drag viewingVideo part end ------


        // ------- drag clip  video start -----

        this.state.pan_clipVideo.setValue({x:0, y:0});
        this.state.pan_clipVideo.addListener((value) => {
            this.handleVideoMovePosition(value, 'ClipVideo');
            this.handleVideoMovePosition_AnimatedFriendsList(value, 'ClipVideo');
        });
        this.panResponder_clipVideo = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) => {
                console.log('locationX :' + e.nativeEvent.locationX);
                console.log('locationY :' + e.nativeEvent.locationY);
                this.setState({pressPosition_ClipVideo: {
                    x: e.nativeEvent.locationX,
                    y: e.nativeEvent.locationY,
                }});
                return true;
            },
            onPanResponderMove: Animated.event([
                null, { dx: this.state.pan_clipVideo.x, dy: this.state.pan_clipVideo.y }
            ]),
            onPanResponderRelease: (e, gesture) => {
                Animated.spring(this.state.pan_clipVideo, {
                    toValue: { x: 0, y: 0 },
                    friction: 30
                }).start();
                // console.log(this.currentAvatar);
                if(this.currentAvatar>0){
                    let listLength = this.props.init.saved_friends_list.length;
                    if(this.props.init.saved_friends_list.length > 3) {
                        listLength = 3;
                    }
                    let difff = listLength - this.currentAvatar;
                    if(difff > 0){
                        this.shareToPopupAlert_ClipVideo(this.props.init.saved_friends_list[difff].userId, this.props.init.contentid);
                    }
                }
                this.currentAvatar = 0;
                this.props.emitMoveOnAvatar(0);


                /* emit animated avatar when release video */
                if(this.currentAnimatedListAvatar > 0) {
                    this.shareToPopupAlert_ClipVideo(this.props.init.saved_friends_list[this.currentAnimatedListAvatar].userId, this.props.init.contentid);
                }

            },
        });

        // ------- drag clip  video end -----



        // ----drag video---end-------------------

        let calculateResults = this.calculateFriendsAvatar();
        console.log(calculateResults);
        this.setState({avatarsSize: calculateResults});

        this.getAnimatedFriendsListAbsolutePosition();
        globalEventEmitter.addListener('AnimatedFriendsListAbsolutePosition', (res)=>{
            this.state.AnimatedFriendsListAbsolutePosition = res;
            // console.log(res);
        });
        globalEventEmitter.addListener('startViewingVideo', (videoRes)=>{
            this.setState({
                showViewingVideo: true,
                viewingVideoContent: videoRes
            })
        });
        globalEventEmitter.addListener('endViewingVideo', (videoRes)=>{
            this.setState({
                showViewingVideo: false,
                viewingVideoContent: videoRes
            })
        });
        globalEventEmitter.addListener('openVideoEditor', ()=>{
            if(!this.state.showVideoEditor) {
                this.setState({
                    showVideoEditor: true,
                    clipDurationTime: this.state.wholeVideoDuration
                });
                this.currentClipVideoTime = 0;
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.init.videoContent_ReceivedFromFriendShared && nextProps.init.videoContent_ReceivedFromFriendShared.vId> this.state.pushId &&
            nextProps.init.videoContent_ReceivedFromFriendShared.video.type === 'OTT') {
            this.setState({
                pushId: nextProps.init.videoContent_ReceivedFromFriendShared.vId,
                removeSecondVideo : false,
                primaryVideoCovered: false,
                removeViewingVideo: false,
            });
            this.setState({videoContent_ReceivedFromFriendShared: nextProps.init.videoContent_ReceivedFromFriendShared});
            this.closeEditor();
            // this.setState({OttOffset_leftBottom: 0});
        }

        if(nextProps.init.videoContent_ReceivedFromFriendShared && nextProps.init.videoContent_ReceivedFromFriendShared.vId> this.state.pushId &&
            nextProps.init.videoContent_ReceivedFromFriendShared.video.type === 'Live') {
            this.props.switchComponent('Live');
            this.props.switchLiveCategoryVideo(nextProps.init.videoContent_ReceivedFromFriendShared.contentid, false, nextProps.init.videoContent_ReceivedFromFriendShared.video.offset);
            this.props.navigateTo('', '', 'Info', 'home');
            this.props.setLeftTopVideoMode('Live');
            this.props.currentHamburgerMarkAt('Live', false);
            let sharer = nextProps.init.videoContent_ReceivedFromFriendShared.sharer;
            AsyncStorage.setItem('tempStoreSharer_beforeNavigateToLivePlaying', JSON.stringify(sharer));
            nextProps.init.videoContent_ReceivedFromFriendShared = {};
        }


        if(nextProps.init.scenes && nextProps.init.scenes.scenes && nextProps.init.scenes.scenes.length > 0) {
            this.setState({wholeVideoDuration: nextProps.init.scenes.scenes[nextProps.init.scenes.scenes.length - 1].end/1000});
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('HeaderHeight').then((res)=>{
            this.headerHeight = Number(res);
        });
    }

    componentWillUnmount() {
        this.setState({fullScreen: false});
    }


    shareToPopupAlert(shareTo, contentid) {
        Alert.alert(
            'Video Share to '+ shareTo,
            'You are going to invite your friend to watch the ' + contentid + ' OTT',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () => {
                    let content = {
                        sharer: {
                            sid: this.props.app.sid,
                            homeid: this.props.app.homeid
                        },
                        contentid: contentid,
                        video: {
                            type: 'OTT',
                            offset: this.state.OttOffset,
                            url: AllUrls.videoUri(contentid)
                        }
                    };
                    console.log(shareTo);
                    console.log(content);
                    this.props.socket.emit('shareVideoTo', shareTo, content)
                }},
            ],
            { cancelable: false }
        )
    }

    calculateFriendsAvatar() {
        let moreIconLengthX = this.state.ipad.width * (3 / 13) * (1 / 5);
        let avatarsSize = [];
        let num = 1;
        while (num<4) {
            avatarsSize.push(
                {
                    left: Math.floor(this.state.ipad.width - moreIconLengthX - 50 * num),
                    right: Math.floor(this.state.ipad.width - moreIconLengthX - 50 * (num-1) - 5),
                }
            );
            ++num;
        }
        return avatarsSize;
    }


    handleVideoMovePosition_AnimatedFriendsList(val, videoPosition) {
        // the height of each friend item is 50
        let friendsNumber = this.props.init.saved_friends_list ? this.props.init.saved_friends_list.length : 0;
        if(friendsNumber > 0 && this.state.AnimatedFriendsListAbsolutePosition.isShowing) {
            let listRange = {
                xMin: this.state.AnimatedFriendsListAbsolutePosition.x,
                xMax: this.state.AnimatedFriendsListAbsolutePosition.x + this.state.AnimatedFriendsListAbsolutePosition.listWidth,
                yMin: this.state.AnimatedFriendsListAbsolutePosition.y - this.state.AnimatedFriendsListAbsolutePosition.scrollOffsetY,
                yMax: this.state.AnimatedFriendsListAbsolutePosition.y + friendsNumber * 50 - this.state.AnimatedFriendsListAbsolutePosition.scrollOffsetY
            };
            let x, y;
            if(videoPosition === 'LeftTop') {
                x = this.state.pressPosition.x + val.x;
                y = this.state.pressPosition.y + val.y;
            } else if(videoPosition === 'LeftBottomVideo'){
                x = this.state.pressPosition_BotttomVideo.x + val.x;
                y = this.state.ipad.height - this.headerHeight - this.state.bottomVideoHeight + this.state.pressPosition_BotttomVideo.y + val.y;
            } else if(videoPosition === 'ViewingVideo') {
                x = this.state.pressPosition_ViewingVideo.x + val.x;
                y = this.state.ipad.height - this.headerHeight - this.state.bottomVideoHeight + this.state.pressPosition_ViewingVideo.y + val.y;
            } else if(videoPosition === 'ClipVideo') {
                x = this.state.pressPosition_ClipVideo.x + val.x;
                y = this.state.ipad.height - this.headerHeight - this.state.clipVideoHeight + this.state.pressPosition_ClipVideo.y + val.y;
            }
            if(x > listRange.xMin && x < listRange.xMax && y > listRange.yMin && y < listRange.yMax) {
                let tempAvatra = this.currentAnimatedListAvatar;
                for(let i = 0; i < friendsNumber; i++) {
                    if(y > listRange.yMin + i * 50 && y < listRange.yMin + (i+1) * 50) {
                        if(i !== tempAvatra && (i+1) * 50 >  this.state.AnimatedFriendsListAbsolutePosition.scrollOffsetY) {
                            this.currentAnimatedListAvatar = i;
                            globalEventEmitter.emit('AnimatedFriendsListCurrentHoverAvatar', i);
                        }
                    }
                }
            } else {
                if(this.currentAnimatedListAvatar !== -1) {
                    this.currentAnimatedListAvatar = -1;
                    globalEventEmitter.emit('AnimatedFriendsListCurrentHoverAvatar', -1);
                }
            }
        } else {
            if(this.currentAnimatedListAvatar !== -1) {
                this.currentAnimatedListAvatar = -1;
                globalEventEmitter.emit('AnimatedFriendsListCurrentHoverAvatar', -1);
            }
        }
    }

    handleVideoMovePosition(val, videoPosition){
        let temp_currentAvatar = this.currentAvatar;
        let abs_x, abs_y;
        if(videoPosition === 'LeftTop') {
            abs_x = this.state.pressPosition.x + val.x;
            abs_y = this.state.pressPosition.y + val.y;
            if(val.y > -1) { // under the Header
                if(this.currentAvatar > 0) {
                    this.currentAvatar = 0;
                    this.props.emitMoveOnAvatar(0);
                }
                return true;
            }
        }

        if(videoPosition === 'LeftBottomVideo') {
            abs_x = this.state.pressPosition_BotttomVideo.x + val.x;
            abs_y = this.state.ipad.height - this.state.bottomVideoHeight + this.state.pressPosition_BotttomVideo.y + val.y;

            // console.log("absx is ",abs_x)
            // console.log("absy is", abs_y)
            // console.log("primary video width ", this.state.primaryVideoWidth)
            // console.log("primary video height ", this.state.primaryVideoHeight)
            // console.log("header height is ", this.headerHeight)
            if( abs_x > 0 &&  abs_x < this.state.primaryVideoWidth && Math.abs(abs_y) > this.headerHeight && Math.abs(abs_y) < this.headerHeight + this.state.primaryVideoHeight )
            {
                !this.state.primaryVideoCovered && this.setState({
                    primaryVideoCovered : true
                },()=> console.log('covered to the video'))
                return true
            } else{
                this.state.primaryVideoCovered && this.setState({
                    primaryVideoCovered : false
                })
            }
            //remove the video
            if(  (val.x< 0 &&  Math.abs(val.x) > this.state.primaryVideoWidth/5 ) || val.y >  this.state.bottomVideoHeight/3  )
            {
                !this.state.removeSecondVideo && this.setState({
                    removeSecondVideo : true
                },()=> console.log('covered to the video'))
                return true
            } else{
                this.state.removeSecondVideo && this.setState({
                    removeSecondVideo : false
                })
            }
            let _differ = this.state.ipad.height - this.state.bottomVideoHeight - this.headerHeight; // distance between HeaderBar-Bottom and BottomVideo-top
            if(val.y > -1-_differ) {
                if(this.currentAvatar > 0) {
                    this.currentAvatar = 0;
                    this.props.emitMoveOnAvatar(0);
                }
                return true;
            }
        }

        if(videoPosition === 'ViewingVideo') {
            abs_x = this.state.pressPosition_ViewingVideo.x + val.x + this.state.ipad.width * (8 / 25);
            abs_y = this.state.ipad.height - this.state.viewingVideoHeight + this.state.pressPosition_ViewingVideo.y + val.y;

            if( abs_x > 0 &&  abs_x < this.state.primaryVideoWidth && Math.abs(abs_y) > this.headerHeight && Math.abs(abs_y) < this.headerHeight + this.state.primaryVideoHeight )
            {
                !this.state.primaryVideoCovered && this.setState({
                    primaryVideoCovered : true
                },()=> console.log('covered to the video'))
                return true
            } else{
                this.state.primaryVideoCovered && this.setState({
                    primaryVideoCovered : false
                })
            }
            //remove the viewing video
            if(  (val.x > 0 &&  Math.abs(val.x) > this.state.primaryVideoWidth ) || val.y >  this.state.viewingVideoHeight * 0.6  )
            {
                !this.state.removeViewingVideo && this.setState({
                    removeViewingVideo : true
                },()=> console.log('covered to the video'))
                return true
            } else{
                this.state.removeViewingVideo && this.setState({
                    removeViewingVideo : false
                })
            }
            return;
        }

        if(videoPosition === 'ClipVideo') {
            abs_x = this.state.pressPosition_ClipVideo.x + val.x;
            abs_y = this.state.ipad.height - this.state.clipVideoHeight + this.state.pressPosition_ClipVideo.y + val.y;

            let _differ = this.state.ipad.height - this.state.clipVideoHeight - this.headerHeight; // distance between HeaderBar-Bottom and BottomVideo-top
            if(val.y > -1-_differ) {
                if(this.currentAvatar > 0) {
                    this.currentAvatar = 0;
                    this.props.emitMoveOnAvatar(0);
                }
                return true;
            }
        }

        let calculateResults = this.calculateFriendsAvatar();
        // console.log('abs_x : '+abs_x);
        if(this.currentAvatar === 0) {
            calculateResults.forEach((item, idx)=>{
                if(abs_x > item.left && abs_x < item.right)
                    this.currentAvatar = idx+1;
            });
        }
        if(this.currentAvatar > 0) {
            calculateResults.forEach((item, idx)=>{
                if(abs_x > item.left && abs_x < item.right && this.currentAvatar !== idx+1)
                    this.currentAvatar = idx+1;
            });
        }
        if(temp_currentAvatar !== this.currentAvatar){
            console.log("currentAvatar : "+this.currentAvatar); // avatar number from right to left is 1,2,3
            this.props.emitMoveOnAvatar(this.currentAvatar);
        }
    }

    inWhichAvatar(abs_x, calculateResults){
        let ava = 0;
        calculateResults.forEach((item, idx)=>{
            if(abs_x > item.left && abs_x < item.right) return idx;
        });
        return ava;
    }

    videoFullScreenFunc(val) {
        this.setState({fullScreen: val});
    }
    getCurrentOttOffset(val) {
        this.setState({OttOffset: val.toFixed(2)});
    }
    getCurrentOttOffset_leftBottom(val) {
        this.setState({OttOffset_leftBottom: val.toFixed(2)});
    }

    // tempSharer and LeftBottomSharer is in Live mode.
    getTempSharer(val) {
    }
    getLeftbottomSharer(val) {
    }

    getAnimatedFriendsListAbsolutePosition() {
        AsyncStorage.getItem('AnimatedFriendsListAbsolutePosition').then((res)=>{
            this.state.AnimatedFriendsListAbsolutePosition = JSON.parse(res);
        })
    }

    closeBottomVideo() {
        console.log("close the bottom video!!");
        this.state.pan_bottomVideo.setValue({x:0, y:0});
        this.setState({ videoContent_ReceivedFromFriendShared: {} });
        this.setState({primaryVideoCovered: false});
    }

    getCurrentOttOffset_ViewingVideo(tIme) {
        // console.log(tIme);
    }

    closeViewingVideo() {
        console.log("close the Viewing video!!");
        this.state.pan_viewingVideo.setValue({x:0, y:0});
        this.setState({
            primaryVideoCovered: false,
            removeViewingVideo: false
        });
        globalEventEmitter.emit('endViewingVideo', null);
    }

    render() {
        const panStyle = {
            transform: this.state.pan.getTranslateTransform()
        };
        const pan_bottomVideo_Style = {
            transform: this.state.pan_bottomVideo.getTranslateTransform()
        };
        const pan_viewingVideo_Style = {
            transform: this.state.pan_viewingVideo.getTranslateTransform()
        };
        return(
            <View style={styles.body}>
                <Animated.View
                    style={[panStyle,  this.state.fullScreen? styles.LeftTopfulScreen : styles.leftTopAnimatedView, this.state.primaryVideoCovered ? styles.HighlightBorder: {}]}
                    {...this.panResponder.panHandlers}
                    onLayout={(event)=>{ this.setState({primaryVideoHeight: event.nativeEvent.layout.height , primaryVideoWidth : event.nativeEvent.layout.width}); }}

                >
                    <TouchableOpacity style={[styles.videoTouchBar, this.state.fullScreen? commonStyles.display_none: commonStyles.display_flex]}>
                        { !this.state.primaryVideoCovered && <Text style={styles.videoTouchBar_text}>Press and drag to share video</Text> }
                        { this.state.primaryVideoCovered && <Text style={styles.videoTouchBar_text}>This video player will be replaced!</Text> }
                    </TouchableOpacity>
                    <LeftTop callback={this.videoFullScreenFunc.bind(this)}
                             currentOttOffset={this.getCurrentOttOffset.bind(this)}
                             socket = {this.props.socket}
                             OttOffset_leftBottom={this.state.OttOffset_leftBottom}
                             Emitted_tempSharer={this.getTempSharer.bind(this)}
                             Emitted_LeftbottomSharer={this.getLeftbottomSharer.bind(this)}
                             hasLeftBottomVideo={this.state.videoContent_ReceivedFromFriendShared.contentid}
                    />
                </Animated.View>

                <View style={styles.left}>
                    <View style={{flex: 1,}}/>
                    <View style={[styles.leftBottom, this.state.fullScreen? commonStyles.display_none: commonStyles.display_flex]}>
                        <LeftBottom socket = {this.props.socket} leftBottomVideoName={this.state.videoContent_ReceivedFromFriendShared.contentid}/>
                        {
                            this.state.videoContent_ReceivedFromFriendShared.contentid &&
                            <View style={[styles.leftBottomVideoFake]} />
                        }
                    </View>
                </View>

                {
                    this.state.videoContent_ReceivedFromFriendShared.contentid &&
                    <Animated.View
                        style={[pan_bottomVideo_Style,  styles.leftBottomVideo, this.state.fullScreen? commonStyles.display_none: commonStyles.display_flex]}
                        {...this.panResponder_bottomVideo.panHandlers}
                        onLayout={(event)=>{ this.setState({bottomVideoHeight: event.nativeEvent.layout.height}); }}
                    >
                        <TouchableOpacity style={ this.state.removeSecondVideo ? styles.videoTouchBar_bottomVideo_delete :  styles.videoTouchBar_bottomVideo}>
                            { !this.state.primaryVideoCovered && !this.state.removeSecondVideo && <Text style={styles.videoTouchBar_text}>Press and drag to share video</Text> }

                            { this.state.primaryVideoCovered && <Text style={styles.videoTouchBar_text}>Drop to replace the video</Text> }

                            {this.state.removeSecondVideo  && <Text style={styles.videoTouchBar_text_remove}> Release to remove the video </Text> }
                        </TouchableOpacity>
                        <LeftBottomVideo videoContent={this.state.videoContent_ReceivedFromFriendShared}
                                         currentOttOffset={this.getCurrentOttOffset_leftBottom.bind(this)}
                        />
                    </Animated.View>
                }



                <View style={[styles.middle, this.state.fullScreen? commonStyles.display_none: commonStyles.display_flex]}>
                    <Middle selectedTab={this.props.selectedTab} socket = {this.props.socket}  leftBottomVideoName={this.state.videoContent_ReceivedFromFriendShared.contentid}/>
                </View>


                {
                    this.state.showViewingVideo &&
                    <Animated.View
                        style={[pan_viewingVideo_Style, styles.viewingVideo, this.state.fullScreen? commonStyles.display_none: commonStyles.display_flex]}
                        {...this.panResponder_viewingVideo.panHandlers}
                        onLayout={(event)=>{ this.setState({viewingVideoHeight: event.nativeEvent.layout.height}); }}
                    >
                        <TouchableOpacity style={ this.state.removeViewingVideo ? styles.videoTouchBar_viewingVideo_delete : styles.videoTouchBar_viewingVideo }>
                            { !this.state.primaryVideoCovered && !this.state.removeViewingVideo && <Text style={styles.videoTouchBar_text}>Press and drag to share video</Text> }

                            { this.state.primaryVideoCovered && <Text style={styles.videoTouchBar_text}>Drop to replace the video</Text> }

                            {this.state.removeViewingVideo  && <Text style={styles.videoTouchBar_text_remove}> Release to remove the video </Text> }
                        </TouchableOpacity>
                        <ViewingVideo videoContent={this.state.viewingVideoContent}
                                      currentOttOffset={this.getCurrentOttOffset_ViewingVideo.bind(this)}
                        />
                    </Animated.View>
                }


                {this.state.showVideoEditor && this.renderVideoEditor()}


            </View>
        )
    }

    /* video editor part ===== start ====== */

    renderVideoEditor() {
        const _url = AllUrls.videoUri(this.props.hamburgerActions.Recorded_CurrentVideoName);
        const posterUrl = AllUrls.videoThumbnailImage(this.props.hamburgerActions.Recorded_CurrentVideoName, 1, 'thumbnail.jpg');
        const panStyle_clipvideo = {
            transform: this.state.pan_clipVideo.getTranslateTransform()
        };

        return(
            <View style={[styles.videoEditorView, this.state.fullScreen? commonStyles.display_none: commonStyles.display_flex]}>
                <TouchableOpacity style={styles.closeEditorButton} onPress={()=>{this.closeEditor()}}>
                    <Icons name={'close'} color={'#FFF'} size={20} />
                </TouchableOpacity>

                <View style={[styles.editorBar, styles.marginTop30]}>
                    <Text style={styles.editorBarTitle}>Start from:</Text>
                    <View style={styles.sliderBox}>
                        <View style={styles.sliderBoxLeft}>
                            <Slider
                                value={this.state.videoEditorStartValue}
                                onValueChange={val => this.setStartTime(val)}
                            />
                        </View>
                        <View style={styles.sliderBoxRight}>
                            <Text style={styles.sliderBoxRightText}>
                                Time: {toHHMMSS(this.state.clipStartTime)}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.editorBar}>
                    <Text style={styles.editorBarTitle}>Duration:</Text>
                    <View style={styles.sliderBox}>
                        <View style={styles.sliderBoxLeft}>
                            <Slider
                                value={this.state.videoEditorDurationValue}
                                onValueChange={val => this.setClipDuration(val)}
                            />
                        </View>
                        <View style={styles.sliderBoxRight}>
                            <Text style={styles.sliderBoxRightText}>
                                Time: {toHHMMSS(this.state.clipDurationTime)}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.editorControlBar}>
                    {
                        this.state.displaySavedVideo &&
                        <TouchableOpacity style={styles.saveButtonView} onPress={()=>{this.closeClipVideoView()}}>
                            <Text style={styles.saveClipText}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    }
                    {
                        !this.state.displaySavedVideo &&
                        <TouchableOpacity style={styles.saveButtonView} onPress={()=>{this.previewClipData()}}>
                            <Text style={styles.saveClipText}>
                                Preview
                            </Text>
                        </TouchableOpacity>
                    }
                    <View style={styles.saveButtonView} />
                    <TouchableOpacity style={styles.saveButtonView} onPress={()=>{this.saveClipData()}}>
                        <Text style={styles.saveClipText}>
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>


                {
                    this.state.displaySavedVideo &&
                    <Animated.View
                        style={[panStyle_clipvideo, styles.clipVideoAnimatedView ]}
                        {...this.panResponder_clipVideo.panHandlers}
                        onLayout={(event)=>{  this.setState({clipVideoHeight: event.nativeEvent.layout.height}); }}
                    >
                        <TouchableOpacity style={[styles.videoTouchBar]}>
                            <Text style={styles.videoTouchBar_text}>Press and drag to share video</Text>
                        </TouchableOpacity>
                        <View style={styles.clipVideoView}>
                            <VideoClipPlayer
                                autoPlay={true}
                                url={_url}
                                poster = {posterUrl}
                                onProgress={this.onVideoPlayerProgress_clip.bind(this)}
                                onLoad={this.onVideoPlayerLoad_clip.bind(this)}
                                rotateToFullScreen = {false}
                                showLive = {false}
                                style={{flex:1}}
                                displayFullScreenIcon={false}
                                hideCoverFullScreenIcon={true}
                                displayControlBar={false}
                                displayReplayButton={this.state.displayReplayButton}
                                replayClippedVideo={()=>{this.replayClippedVideo()}}
                                ref = 'VideoClipRef'
                            />
                        </View>
                    </Animated.View>
                }


            </View>
        )
    }

    closeEditor() {
        this.setState({showVideoEditor: false});
        this.closeClipVideoView();
    }

    seekVideoTo(time) {
        if(this.refs && this.refs.VideoClipRef) {
            this.refs.VideoClipRef.player.seek(time);
        }
    }

    setStartTime(val){
        this.setState({ videoEditorStartValue: val });
        let timee = Number((val * this.state.wholeVideoDuration).toFixed(0));
        this.setState({clipStartTime : timee}, ()=>{
            let restTime = this.state.wholeVideoDuration - val * this.state.wholeVideoDuration;
            let dur = Number((this.state.videoEditorDurationValue * restTime).toFixed(0));
            this.setState({clipDurationTime: dur});
            this.seekVideoTo(this.state.clipStartTime);
        });
    }

    setClipDuration(val){
        this.setState({ videoEditorDurationValue: val });
        let restTime = this.state.wholeVideoDuration - this.state.clipStartTime;
        let dur = Number((val * restTime).toFixed(0));
        this.setState({clipDurationTime: dur});
        if(this.state.clipVideoPlayToDurationEnd) {
            this.setState({displayReplayButton: (dur < this.currentClipVideoTime - this.state.clipStartTime)}); //control replay button});
        }
    }

    closeClipVideoView() {
        this.currentClipVideoTime = 0;
        this.setState({displaySavedVideo: false});
    }

    previewClipData() {
        console.log('clip start : ' + this.state.clipStartTime);
        console.log('clip duration : ' + this.state.clipDurationTime);
        if(this.state.clipDurationTime > 0) {
            this.setState({displaySavedVideo: true});
        } else {
            Alert.alert(
                'Video duration can not be 0', '',
                { cancelable: false }
            )
        }
    }

    saveClipData() {
        Alert.alert(
            'Do you want to save this clipped video?',
            '',
            [
                {text: 'Cancel', onPress: () => {
                    this.closeEditor();
                }},
                {text: 'Yes', onPress: () => {
                    console.log('clip start : ' + this.state.clipStartTime);
                    console.log('clip duration : ' + this.state.clipDurationTime);
                    // pass parameter to server
                    this.closeEditor();
                }},
            ],
            { cancelable: false }
        );
    }

    onVideoPlayerProgress_clip(e) {
        this.currentClipVideoTime = e.currentTime;
        if(e.currentTime > this.state.clipStartTime + this.state.clipDurationTime) {
            this.refs.VideoClipRef.pauseIt();
            this.setState({
                displayReplayButton: true,
                clipVideoPlayToDurationEnd: true,
            });
        }
    }

    onVideoPlayerLoad_clip() {
        this.setState({clipVideoPlayToDurationEnd: false});
        this.seekVideoTo(this.state.clipStartTime);
    }

    replayClippedVideo() {
        this.setState({
            displayReplayButton: false,
            clipVideoPlayToDurationEnd: false,
        });

        if(this.refs && this.refs.VideoClipRef) {
            this.refs.VideoClipRef.player.seek(this.state.clipStartTime);
            this.refs.VideoClipRef.play();
        }
    }

    shareToPopupAlert_ClipVideo(shareTo, contentid) {
        Alert.alert(
            'Video Share to '+ shareTo,
            'You are going to invite your friend to watch the clipped ' + contentid,
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () => {
                    // todo: share clipped video
                    // let content = {
                    //     sharer: {
                    //         sid: this.props.app.sid,
                    //         homeid: this.props.app.homeid
                    //     },
                    //     contentid: contentid,
                    //     video: {
                    //         type: 'OTT',
                    //         offset: this.state.OttOffset,
                    //         url: AllUrls.videoUri(contentid)
                    //     }
                    // };
                    // this.props.socket.emit('shareVideoTo', shareTo, content)
                }},
            ],
            { cancelable: false }
        )
    }

    /* video editor part ===== end ====== */

}


const styles = StyleSheet.create({
    body: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        position: 'relative',
    },
    left: {
        flex: 8,
        backgroundColor: '#282828',
    },
    leftTopAnimatedView: {
        flex: 1,
        width: '32%',
        height: '30%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 20,
    },
    LeftTopfulScreen: {
        flex:1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 20,
    },
    videoTouchBar: {
        flex: 0.1,
        backgroundColor: '#a1abad',
        justifyContent:'center',
        // zIndex: 2100,
    },
    videoTouchBar_text: {
        textAlign: 'center',
        fontSize: 12,
    },
    videoTouchBar_text_remove: {
        textAlign: 'center',
        fontSize: 12,
        color: '#FFFFFF'
    },
    leftBottom: {
        flex: 2,
        // height: '66%',
        // width: '100%',
    },
    leftBottomVideoFake: {
        flex: 2,
    },
    leftBottomVideo: {
        flex: 1,
        width: '32%',
        height: '30%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 20,
    },
    videoTouchBar_bottomVideo: {
        flex: 0.1,
        backgroundColor: '#a1abad',
        justifyContent:'center',
        position: 'relative'
    },
    videoTouchBar_bottomVideo_delete: {
        flex: 0.1,
        backgroundColor: 'red',
        justifyContent:'center',
        position: 'relative'
    },
    videoTouchBar_viewingVideo: {
        flex: 0.07,
        backgroundColor: '#a1abad',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexDirection: 'row'
    },
    videoTouchBar_viewingVideo_delete: {
        flex: 0.07,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexDirection: 'row'
    },
    bottomVideoCloseIcon: {
        position: 'absolute',
        top: 0,
        right: 5,
        height: '100%',
        justifyContent: 'center',
        zIndex: 21,
    },
    middle: {
        flex: 17,
        backgroundColor: '#202020',
        borderLeftWidth: 2,
        // borderLeftColor: '#00B388',
    },
    right: {
        flex: 2,
        // backgroundColor: '#E05',
        borderLeftWidth: 2,
        // borderLeftColor: '#00B388',
    },

    HighlightBorder: {
        borderWidth: 1,
        borderColor: '#48ff42',
    },

    tabContainer: {
        height: '100%',
    },

    viewingVideo: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 20,
        height: '60%',
        width: '68%',
        backgroundColor: '#000',
    },


    clipVideoAnimatedView: {
        flex: 1,
        width: '100%',
        height: '30%',
        position: 'absolute',
        bottom: '30%',
        left: 0,
        zIndex: 23,
    },
    videoEditorView: {
        width: '32%',
        height: '100%',
        backgroundColor: '#282828',
        position: 'absolute',
        top: '30%',
        left: 0,
        zIndex: 22,
    },
    closeEditorButton: {
        position: 'absolute',
        top: 15,
        right: 10,
        padding: 5,
        zIndex: 5,
    },
    returnToEditorButton: {
        position: 'absolute',
        top: 0,
        left: 10,
        zIndex: 5,
    },
    editorBar: {
        height: '12%',
        width: '100%',
    },
    marginTop30: {
        marginTop: 30
    },
    editorBarTitle: {
        fontSize: 14,
        color: '#FFF',
        marginLeft: 15,
    },
    sliderBox: {
        flexDirection: 'row',
    },
    sliderBoxLeft: {
        width: '75%',
        paddingLeft: 15,
        paddingRight: 15,
    },
    sliderBoxRight: {
        width: '25%',
        alignItems:'center',
        justifyContent: 'center',
    },
    sliderBoxRightText: {
        color: '#FFF',
        fontSize: 12,
    },
    editorControlBar: {
        height: '18%',
        width: '100%',
        flexDirection: 'row',
    },
    saveButtonView:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    saveClipText: {
        marginRight: 15,
        fontSize: 14,
        width: 80,
        height: 30,
        lineHeight: 30,
        color: '#FFF',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#FFF',
    },
    clipVideoView: {
        flex: 1,
        backgroundColor: '#282828',
    },
});

const commonStyles = StyleSheet.create({
    display_none:{
        display: 'none',
    },
    display_flex: {
        display: 'flex',
    },
});


//---------------    container    -----------------
const mapStateToProps = state => ({
    init: state.init,
    app: state.app,
    selectedTab: state.selectedTab,
    hamburgerActions: state.hamburgerActions,
    nav: state.nav,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        emitMoveOnAvatar, switchLiveCategoryVideo, navigateTo,
        videoReceivedFromFriendShared, switchComponent, currentHamburgerMarkAt, setLeftTopVideoMode,
        addToVideoQueue, getVideoQueue
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(RecordedWatching);