import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, AlertIOS, Image, ScrollView, Animated, Dimensions, PanResponder, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { globalEventEmitter } from '../../../utils/globalEventEmitter';

import LeftTop from '../VideoPlayingParts/LeftTop';
import LeftBottom from '../VideoPlayingParts/LeftBottom';
import Middle from '../VideoPlayingParts/Middle';
import Right from '../VideoPlayingParts/Right';
import ViewingVideo from '../VideoPlayingParts/middlePages/Viewing/ViewingVideo';
import LeftBottomVideo from './LeftBottomVideo';
import AllUrls from '../../../services/APIUrl';

import { emitMoveOnAvatar, videoReceivedFromFriendShared } from '../../../actions/InitActions';
import { switchRecordedCategoryVideo, setLeftTopVideoMode, switchLiveCategoryVideo } from '../../../actions/CategoryAndVideoSwitchActions';
import { switchComponent, currentHamburgerMarkAt } from '../../../actions/MainPageActions';
import { navigateTo } from '../../../actions/NavigationAction';



class LiveWatching extends Component {
    constructor() {
        super();
        this.currentAvatar = 0;
        this.headerHeight = 0;
        this.currentAnimatedListAvatar = -1;
    }

    state = {
        fullScreen: true,
        pan: new Animated.ValueXY(),
        pan_bottomVideo: new Animated.ValueXY(),
        pan_viewingVideo: new Animated.ValueXY(),
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
        avatarsSize: null,
        LiveOffset: 0,
        LiveOffset_leftBottom: 0,
        primaryVideoHeight: 0,
        primaryVideoCovered: false,
        removeSecondVideo: false,
        videoContent_ReceivedFromFriendShared: {},

        LeftTopVideoFromShare: {
            fromShare: false,
            videoContent: {}
        },

        tempSharer: null,
        LeftBottomVideoSharer: null,

        AnimatedFriendsListAbsolutePosition: {},
        showViewingVideo: false,
        viewingVideoContent: null,
        viewingVideoHeight: 0,
    };


    componentWillMount() {
        // ----drag video---start-----------------

        this.state.pan.setValue({x:0, y:0});
        this.state.pan.addListener((value) => {
            this.handleVideoMovePosition(value, 'LeftTop');
            this.handleVideoMovePosition_AnimatedFriendsList(value, 'LeftTop');
        });
        // Initialize PanResponder with move handling
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) => {
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
                console.log(this.currentAvatar);
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
                        // 1. goingToReplace the video uri , and seek to where it was playing
                        globalEventEmitter.emit('replaceLeftTopVideoByLeftBottomShared', this.state.videoContent_ReceivedFromFriendShared);
                        // 2. Set - LeftTop video is shared from others. If user share leftTop again, it should pass the video's sharer.
                        this.setState({
                            LeftTopVideoFromShare: {
                                fromShare: true,
                                videoContent: this.state.videoContent_ReceivedFromFriendShared
                            }
                        });
                        // 3. reset videoReceivedFromFriendShared, then the LeftBottom video will be removed
                        this.props.videoReceivedFromFriendShared({}, -1);
                        // 4. close the secondary video player.
                        this.closeBottomVideo();
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
                    console.log("inside remove ");
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
                        // nav to OTT page
                        this.props.switchComponent('Recorded');
                        this.props.navigateTo('', '', 'Info', 'home');
                        this.props.setLeftTopVideoMode('Recorded');
                        this.props.currentHamburgerMarkAt('Recorded', false);
                        this.props.switchLiveCategoryVideo(null, false, 0);
                        this.props.switchRecordedCategoryVideo(this.state.viewingVideoContent.contentid, false, Number(this.state.viewingVideoContent.video.offset));
                    })
                }
                Animated.spring(this.state.pan_viewingVideo, {
                    toValue: { x: 0, y: 0 },
                    friction: 30
                }).start();
            },
        });
        // ------ drag viewingVideo part end ------


        // ----drag video---end-----------------

        this.getAnimatedFriendsListAbsolutePosition();
        globalEventEmitter.addListener('AnimatedFriendsListAbsolutePosition', (res)=>{
            this.state.AnimatedFriendsListAbsolutePosition = res;
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

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.init.videoContent_ReceivedFromFriendShared && nextProps.init.videoContent_ReceivedFromFriendShared.vId> this.state.pushId
            && nextProps.init.videoContent_ReceivedFromFriendShared.video.type === 'Live') {
            this.setState({LiveOffset_leftBottom: 0});
            this.setState({
                pushId: nextProps.init.videoContent_ReceivedFromFriendShared.vId,
                removeSecondVideo : false,
                primaryVideoCovered: false
            });
            this.setState({videoContent_ReceivedFromFriendShared: nextProps.init.videoContent_ReceivedFromFriendShared});
        }

        if(nextProps.init.videoContent_ReceivedFromFriendShared && nextProps.init.videoContent_ReceivedFromFriendShared.vId> this.state.pushId
            && nextProps.init.videoContent_ReceivedFromFriendShared.video.type === 'OTT') {
            this.props.switchComponent('Recorded');
            this.props.navigateTo('', '', 'Info', 'home');
            this.props.setLeftTopVideoMode('Recorded');
            this.props.currentHamburgerMarkAt('Recorded', false);
            this.props.switchLiveCategoryVideo(null, false, 0);
            this.props.switchRecordedCategoryVideo(nextProps.init.videoContent_ReceivedFromFriendShared.contentid, false, Number(nextProps.init.videoContent_ReceivedFromFriendShared.video.offset));
            nextProps.init.videoContent_ReceivedFromFriendShared = {};
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
            'You are going to invite your friend to watch the ' + contentid + ' Live',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () => {
                    let sharerrr;
                    if(this.state.LeftBottomVideoSharer) {
                        sharerrr = this.state.LeftBottomVideoSharer;
                    } else if(this.state.tempSharer) {
                        sharerrr = this.state.tempSharer;
                    } else {
                        sharerrr = {
                            sid: this.props.app.sid,
                            homeid: this.props.app.homeid
                        };
                    }
                    let content = {
                        sharer: sharerrr,
                        contentid: contentid,
                        video: {
                            type: 'Live',
                            offset: this.state.LiveOffset,
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
                yMax: this.state.AnimatedFriendsListAbsolutePosition.y + friendsNumber * 50 - this.state.AnimatedFriendsListAbsolutePosition.scrollOffsetY,
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

    closeBottomVideo() {
        console.log("close the bottom video!!");
        this.state.pan_bottomVideo.setValue({x:0, y:0});
        this.setState({ videoContent_ReceivedFromFriendShared: {} });
        this.setState({primaryVideoCovered: false});
    }

    getCurrentOttOffset_ViewingVideo(tIme) {
        // console.log(tIme);
    }

    getCurrentLiveOffset(val) {
        if(Number(val) >= 0){
            this.setState({LiveOffset: Number(val).toFixed(2)});
        }
    }

    getCurrentLiveOffset_leftBottom(val) {
        if(Number(val) >= 0) {
            this.setState({LiveOffset_leftBottom: Number(val).toFixed(2)});
        }
    }

    videoFullScreenFunc(val) {
        this.setState({fullScreen: val});
    }

    getTempSharer(val) {
        this.setState({tempSharer: val});
    }

    getLeftbottomSharer(val) {
        this.setState({LeftBottomVideoSharer: val});
    }

    getAnimatedFriendsListAbsolutePosition() {
        AsyncStorage.getItem('AnimatedFriendsListAbsolutePosition').then((res)=>{
            this.state.AnimatedFriendsListAbsolutePosition = JSON.parse(res);
        })
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
                             CurrentLiveOffset={this.getCurrentLiveOffset.bind(this)}
                             socket = {this.props.socket}
                             LiveOffset_leftBottom={this.state.LiveOffset_leftBottom}
                             Emitted_tempSharer={this.getTempSharer.bind(this)}
                             Emitted_LeftbottomSharer={this.getLeftbottomSharer.bind(this)}
                             hasLeftBottomVideo={this.state.videoContent_ReceivedFromFriendShared.contentid}
                    />
                </Animated.View>


                <View style={styles.left}>
                    <View style={{flex: 1,}}/>
                    <View style={[styles.leftBottom, this.state.fullScreen? commonStyles.display_none: commonStyles.display_flex]}>
                        <LeftBottom socket = {this.props.socket} leftBottomVideoName={this.state.videoContent_ReceivedFromFriendShared.contentid} />
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
                                         CurrentLiveOffset_leftBottom={this.getCurrentLiveOffset_leftBottom.bind(this)}
                        />
                    </Animated.View>
                }

                <View style={[styles.middle, this.state.fullScreen? commonStyles.display_none: commonStyles.display_flex]}>
                    <Middle selectedTab={this.props.selectedTab} socket = {this.props.socket} leftBottomVideoName={this.state.videoContent_ReceivedFromFriendShared.contentid} />
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

                {/* <View style={[styles.right, this.state.fullScreen? commonStyles.display_none: commonStyles.display_flex]}>
                    <Right style={styles.tabContainer}/>
                </View> */}
            </View>
        )
    }

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
    hamburgerActions: state.hamburgerActions,
    selectedTab: state.selectedTab,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        emitMoveOnAvatar, videoReceivedFromFriendShared, switchRecordedCategoryVideo, switchLiveCategoryVideo,
        switchComponent, currentHamburgerMarkAt, setLeftTopVideoMode, navigateTo
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(LiveWatching);