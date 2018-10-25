'use strict';
import React, { Component } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, Image, Switch, AsyncStorage, Animated } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { synchScene, changeScene, getCurrentContents, changeLoadingState } from '../../../actions/SceneActions';
import { getLatestScene } from '../../../actions/SceneContentsAction';
import { resetInitStateAction } from '../../../actions/InitActions';
import { switchComponent, currentHamburgerMarkAt } from '../../../actions/MainPageActions';
import { switchLiveCategoryVideo, switchRecordedCategoryVideo, setLeftTopVideoMode } from '../../../actions/CategoryAndVideoSwitchActions';
import { navigateTo } from '../../../actions/NavigationAction';

import { APIService } from '../../../services/APIService';
import AllUrls from '../../../services/APIUrl';
import { parseRes } from '../../../utils/Util';
import VideoPlayerLive from '../../../utils/video-player-live-mode/index'
import VideoPlayerOtt from '../../../utils/video-player-OTT-mode/index'

import { globalEventEmitter } from '../../../utils/globalEventEmitter';


export class LeftTop extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        currentUserId: '',
        rate: 1,
        volume: 1,
        muted: false,
        resizeMode: 'contain',
        duration: 0.0,
        currentTime: 0.0,
        controls: false,
        paused: true,
        isBuffering: false,
        start: 0,
        end: 0,
        image: 'x',
        remindText: '',
        isFullScreen: true,
        moveableMaxTime: 0,
        showLive: false,
        initedLiveVideo: false,
        initedOttVideo: false,
        currentOttVideo: '',
        currentLiveVideo: '',
        dropVideoOttOffset: 0, // get from the dropped secondary video
        dropVideoLiveOffset: 0, // get from the dropped secondary video
        synchSceneSucceed: true,
        offset: 0,
        OTTautoplay: false,
        tempSharer: null,             //tempSharer is the one who shared the video and current user navigate from other page
        LeftBottomVideoSharer: null,  // leftBottom video sharer
        displayEditIcon: true,

        currentPrimaryVideo: {
            contentid: '',
            offset: 0
        },
    };

    current_sceneid = undefined;
    current_sceneid_ott = 1;
    crrTime = 0;
    sceneid_watchSharedVideo = undefined; //when watch the video that shared from other

    _getCurrentContents(app, init, sceneID, contentid) {
        // if (init.scenes && init.scenes.scenes.length > 0) {
            this.props.getCurrentContents(app, init, sceneID, contentid);
        // }
    }

    componentWillMount() {
        // before render()
        let init = this.props.init;
        if (init.scene) {
            let start = init.scene.start / 1000;
            let end = init.scene.end / 1000;
            this.setState({
                start: start,
                end: end,
                image: init.scene.image,
                remindText: ''
            })
        }

        let hamburgerActions = this.props.hamburgerActions;
         
        if (this.props.hamburgerActions.isLive){
            AsyncStorage.getItem('tempStoreSharer_beforeNavigateToLivePlaying').then((res)=>{
                if(res) {
                    let sharer = JSON.parse(res);
                    this.props.synchScene(sharer, this.props.init, this.props.hamburgerActions);
                    this.setState({
                        tempSharer: sharer,
                        offset: Number(hamburgerActions.Live_seekTo)
                    });
                    this.props.Emitted_tempSharer(sharer);
                } else {
                    // normal get into this component, not share.
                    this.synchVideoFunc(-1);
                    this.props.synchScene(this.props.app, this.props.init, this.props.hamburgerActions);
                }
                this.props.hamburgerActions.Live_seekTo = 0;
            });
        }else{
            this._getCurrentContents(this.props.app, this.props.init, 1, this.props.hamburgerActions.Recorded_CurrentVideoName);
            if(this.props.hamburgerActions.Recorded_seekTo > 0) {
                this.setState({dropVideoOttOffset: this.props.hamburgerActions.Recorded_seekTo});
            }
            this.props.hamburgerActions.Recorded_seekTo = 0;
        }

        this.setState ({
            currentOttVideo : hamburgerActions.Recorded_CurrentVideoName,
            currentLiveVideo : hamburgerActions.Live_CurrentVideoName
        }, () => {
            if(this.state.dropVideoOttOffset > 0 && !this.state.initedOttVideo) {
                this.setState({OTTautoplay: true});
            }
        });

        AsyncStorage.getItem('USER_ID').then((uid) => {
            this.setState({currentUserId: uid});
        });

        AsyncStorage.setItem('NowPlayingLeftBottom', 'No');
    }

    componentDidMount () {
        // after render()
        // this.props.synchVideo(this.props.app);

        globalEventEmitter.addListener('startWatchLeftBottomVideo', ()=>{
            this.pauseLeftTopVIdeo();
        });
        globalEventEmitter.addListener('startLeftBottomPlaying', ()=>{
            this.pauseLeftTopVIdeo();
        });
        globalEventEmitter.addListener('startViewingVideo', ()=>{
            this.pauseLeftTopVIdeo();
        });
        globalEventEmitter.addListener('replaceLeftTopVideoByLeftBottomShared', (res)=>{
            this.updateVideoFromShared(res);
            // console.log(res);
        });
        globalEventEmitter.addListener('replaceLeftTopVideoByQueueItem', (res) =>{
            this.updateVideoFromQueue(res)
        });
        globalEventEmitter.addListener('sharedVideoFromFriend', (res)=>{
            this.updateVideoFromShared(res);
        });
    }

    pauseLeftTopVIdeo() {
        if(this.refs.videoPlayerRef_Ott) {
            this.refs.videoPlayerRef_Ott.pauseIt();
        }
        if(this.refs.videoPlayerRef) {
            this.refs.videoPlayerRef.pauseIt();
        }
    }


    updateVideoFromQueue(res) {
        if(this.props.hamburgerActions.isLive && res.content.video.type === 'OTT') {
            // jump to Recorded page
            this.props.switchComponent('Recorded');
            this.props.switchRecordedCategoryVideo(res.content.contentid, false, res.content.video.offset);
            this.props.navigateTo('', '', 'Info', 'home');
            this.props.setLeftTopVideoMode('Recorded');
            this.props.currentHamburgerMarkAt('Recorded', false);
        } else if(!this.props.hamburgerActions.isLive && res.content.video.type === 'OTT') {
            // on current OTT page and change content if necessary
            if (res.content.contentid !== this.state.currentOttVideo) {
                this.props.init.globalMD = null;
                this.setState({
                    OTTautoplay: true,
                    initedOttVideo: false,
                });
                this._getCurrentContents(this.props.app, this.props.init, 1, res.content.contentid);
                this.setState({currentOttVideo: res.content.contentid});
                this.props.hamburgerActions.Recorded_CurrentVideoName = res.content.contentid;
            } else {
                if (this.refs.videoPlayerRef_Ott) {
                    this.refs.videoPlayerRef_Ott.player.seek(res.content.video.offset);
                }
            }
        }
    }

    updateVideoFromShared(res) {
        if(res.contentid) {
            if (this.props.hamburgerActions.isLive) {
                if (res.contentid !== this.state.currentLiveVideo) {
                    this.props.resetInitStateAction();
                    this.props.init.globalMD = null;
                    this.setState({
                        initedLiveVideo: false,
                        currentLiveVideo: res.contentid,
                        dropVideoLiveOffset: res.video.offset,
                        offset: res.video.offset,    // the state offset is also used to get website primary video offset when video is onProgress.
                    });
                    this.props.hamburgerActions.Live_CurrentVideoName = res.contentid;
                    this.props.synchScene(res.sharer, this.props.init, this.props.hamburgerActions);
                    this.setState({LeftBottomVideoSharer: res.sharer});
                    this.props.Emitted_LeftbottomSharer(res.sharer);
                } else {
                    if (this.refs.videoPlayerRef) {
                        if (res.video.offset > 0) {
                            if (this.props.LiveOffset_leftBottom > 0) {
                                this.refs.videoPlayerRef.player.seek(this.props.LiveOffset_leftBottom);
                            } else {
                                this.refs.videoPlayerRef.player.seek(res.video.offset);
                            }
                        } else {
                            this.refs.videoPlayerRef.player.seek(this.props.LiveOffset_leftBottom);
                        }
                    }
                }

            } else {
                if (res.contentid !== this.state.currentOttVideo) {
                    this.props.resetInitStateAction();
                    this.props.init.globalMD = null;
                    this.setState({
                        OTTautoplay: true,
                        initedOttVideo: false,
                    });
                    this._getCurrentContents(this.props.app, this.props.init, 1, res.contentid);
                    this.setState({
                        currentOttVideo: res.contentid,
                        dropVideoOttOffset: this.props.OttOffset_leftBottom,
                    });
                    this.props.hamburgerActions.Recorded_CurrentVideoName = res.contentid;
                } else {
                    if (this.refs.videoPlayerRef_Ott) {
                        if (res.video.offset > 0) {
                            if (this.props.OttOffset_leftBottom > 0) {
                                this.refs.videoPlayerRef_Ott.player.seek(this.props.OttOffset_leftBottom);
                            } else {
                                this.refs.videoPlayerRef_Ott.player.seek(res.video.offset);
                            }
                        } else {
                            this.refs.videoPlayerRef_Ott.player.seek(this.props.OttOffset_leftBottom);
                        }
                    }
                }
            }
        }
    }


    componentWillReceiveProps(nextProps) {
        let init = nextProps.init;
        if (init.scene) {
            let start = init.scene.start / 1000;
            let end = init.scene.end / 1000;
            this.setState({
                start: start,
                end: end,
                image: init.scene.image,
                remindText: '',
            });
            // this.current_sceneid = init.scene.sceneid;
        }

        if (init.synchSceneSucceed == true) {
            this.setState({synchSceneSucceed: true});
        } else if (init.synchSceneSucceed == false) {
            this.setState({synchSceneSucceed: false});
        }

        let hamburgerActions = nextProps.hamburgerActions;

        if(hamburgerActions.Recorded_seekTo !== 0) {
            this.setState({dropVideoOttOffset: hamburgerActions.Recorded_seekTo}, () => {
                // nextProps.hamburgerActions.Recorded_seekTo = 0;
            })
        }
        if(hamburgerActions.Live_seekTo !== 0) {
            this.setState({dropVideoLiveOffset: hamburgerActions.Live_seekTo}, () => {
                // nextProps.hamburgerActions.Live_seekTo = 0;
            })
        }


        // if(hamburgerActions.Recorded_CurrentVideoName !== this.state.currentOttVideo) {
        //     this.props.socket.emit('watchingNow', this.state.currentUserId, {contentid: hamburgerActions.Recorded_CurrentVideoName});
        // }
        this.setState ({
            currentOttVideo : hamburgerActions.Recorded_CurrentVideoName,
            currentLiveVideo : hamburgerActions.Live_CurrentVideoName
        });

    }

    componentWillUnmount () {
        AsyncStorage.setItem('tempStoreSharer_beforeNavigateToLivePlaying', '');
        this.setState({
            initedLiveVideo: false,
            initedOttVideo: false,
            tempSharer: null,
            LeftBottomVideoSharer: null,
        });
        this.props.Emitted_tempSharer(null);
        this.props.Emitted_LeftbottomSharer(null);
        this.props.resetInitStateAction();
    }

    onPlayOTT=(val)=>{
        console.log('onPlayOTT : ' + val);
        if(val && this.props.hasLeftBottomVideo) {
            globalEventEmitter.emit('startLeftTopPlaying', 1);
            AsyncStorage.setItem('NowPlayingLeftBottom', 'No');
            this._getCurrentContents(this.props.app, this.props.init, this.current_sceneid_ott, this.props.hamburgerActions.Recorded_CurrentVideoName);
        }else {
            globalEventEmitter.emit('stopLeftTopPlaying', 0);
        }
    };

    pressEditOTTVideoIcon(){
        console.log('press Edit icon!');
        globalEventEmitter.emit('openVideoEditor', 1);
    }


    renderLiveVideo_Disconnection () {
        return (
            <TouchableOpacity style={styles.liveVideoUnavailable} onPress={()=>{this.retryLiveVideo()}}>
                    <Image
                        source = {require('../../../assets/images/LiveVideoUnavailable.png')}
                        style={{height: '100%', width: '100%',}}
                    />
            </TouchableOpacity>
        )
    }

    renderLiveVideoPlayer() {
        const _url = AllUrls.videoUri(this.state.currentLiveVideo);
        const posterUrl = AllUrls.videoThumbnailImage(this.state.currentLiveVideo, 1, 'thumbnail.jpg');

        return (
            <View style={styles.container} onLayout={(event) => {
                let {x, y, width, height} = event.nativeEvent.layout;
                AsyncStorage.setItem('onPlaying_Video_Width', JSON.stringify({width, height}));
            }} >
                <VideoPlayerLive
                    url={_url}
                    autoPlay
                    placeholder = {posterUrl}
                    toggleFullScreen={() => this.onFullScreen()}
                    onProgress={this.onVideoPlayerProgress.bind(this)}
                    onLoad={this.onVideoPlayerLoad.bind(this)}
                    onEnd={this.onVideoPlayerEnd.bind(this)}
                    pressGoLiveTV={this.pressGoLiveTV.bind(this)}
                    rotateToFullScreen = {false}
                    style={{flex:1}}
                    moveableMaxTime = {this.state.end}
                    // showLive = {this.state.showLive}
                    showLive = {true}
                    isLiveFullScreen = {this.state.isFullScreen}
                    socket = {this.props.socket}
                    hamburgerActions={this.props.hamburgerActions}
                    ref = 'videoPlayerRef'
                />
            </View>
        )
    }


    renderOttVideoPlayer() {
        const _url = AllUrls.videoUri(this.state.currentOttVideo);
        const posterUrl = AllUrls.videoThumbnailImage(this.state.currentOttVideo, 1, 'thumbnail.jpg');

        return (
            <View style={styles.container}>
                <VideoPlayerOtt
                    url={_url}
                    poster = {posterUrl}
                    toggleFullScreen={() => this.onFullScreen()}
                    onProgress={this.onVideoPlayerProgress_ott.bind(this)}
                    onLoad={this.onVideoPlayerLoad_ott.bind(this)}
                    rotateToFullScreen = {false}
                    showLive = {false}
                    style={{flex:1}}
                    isLiveFullScreen = {this.state.isFullScreen}
                    displayFullScreenIcon = {true}
                    autoPlay={this.state.OTTautoplay}
                    socket = {this.props.socket}
                    hamburgerActions={this.props.hamburgerActions}
                    onPlay={this.onPlayOTT.bind(this)}
                    displayEditIcon={this.state.displayEditIcon}
                    pressEditIcon={()=>this.pressEditOTTVideoIcon()}
                    ref = 'videoPlayerRef_Ott'
                />
            </View>
        )
    }

    onFullScreen() {
        this.props.callback(!this.state.isFullScreen);
        this.setState({isFullScreen: !this.state.isFullScreen}, ()=>{
            if(this.state.isFullScreen) {
                this.setState({displayEditIcon: false});
            } else {
                this.setState({displayEditIcon: true});
            }
            if(this.state.isFullScreen && this.props.hasLeftBottomVideo) {
                this._getCurrentContents(this.props.app, this.props.init, this.current_sceneid_ott, this.props.hamburgerActions.Recorded_CurrentVideoName);
            }
        });
    }

    onVideoPlayerProgress (e) {
        this.crrTime = e.currentTime;
        this.syncContentsWithScene(e);

        if(e.currentTime < 1 && this.state.offset > 0) {
            this.props.CurrentLiveOffset(this.state.offset);
        } else if(this.state.offset === 0){
            this.props.CurrentLiveOffset(0);
        } else {
            this.props.CurrentLiveOffset(e.currentTime);
        }

        // this.displayLiveTVIcon(e);    // this method has action conflict with the 'syncContentsWithScene(e)' method.  Then, it always shows the go live button.
    }


    syncContentsWithScene (e) {
        let onProgressSceneId = this.getOnProgressScene(e.currentTime * 1000);

        if(e.currentTime % 3 < 1 && e.currentTime > 1) {
            let offsetTime = this.synchVideoFunc(e.currentTime);
        }

        if(this.state.tempSharer || this.state.LeftBottomVideoSharer) {
            if(onProgressSceneId !== this.sceneid_watchSharedVideo && onProgressSceneId > 0) {
                if(e.currentTime > 1) {
                    this.sceneid_watchSharedVideo = onProgressSceneId;
                    this._getCurrentContents(this.props.app, this.props.init, onProgressSceneId, this.props.hamburgerActions.Live_CurrentVideoName)
                }
            }
        } else {
            if(onProgressSceneId !== this.current_sceneid && onProgressSceneId > 0) {
                if(e.currentTime > 1) {
                    this.current_sceneid = onProgressSceneId;
                    this._getCurrentContents(this.props.app, this.props.init, onProgressSceneId, this.props.hamburgerActions.Live_CurrentVideoName)
                }
            }
        }
    }

    async synchVideoFunc(currenttime) {
        let offsetTime;
        let body;
        if(this.state.tempSharer) {
            body = {
                sid: this.state.tempSharer.sid,
                homeid: this.state.tempSharer.homeid
            };
        } else if(this.state.LeftBottomVideoSharer){
            body = {
                sid: this.state.LeftBottomVideoSharer.sid,
                homeid: this.state.LeftBottomVideoSharer.homeid
            };
        }else {
            body = {
                sid: this.props.app.sid,
                homeid: this.props.app.homeid
            };
        }

        let synchVideoData = await APIService.synchVideoOffset(body);
        if (synchVideoData.hasData) {
            if(synchVideoData.data && synchVideoData.data.contentid) {
                offsetTime = Number(synchVideoData.data.offset);
                this.state.currentPrimaryVideo = synchVideoData.data;
            }
        } else {
            offsetTime = 0;
        }
        if(offsetTime > 0) {
            this.setState({offset: offsetTime});
        }
        if(currenttime >0 && currenttime > offsetTime && offsetTime !== 0) {
            if(this.state.LeftBottomVideoSharer || this.state.tempSharer)
                return;
            this.refs.videoPlayerRef.pauseIt();
        }

    }

    displayLiveTVIcon (e) {
        let onProgressSceneId = this.getOnProgressScene(e.currentTime * 1000);
        this.props.getLatestScene(this.props.app).then(()=>{
            if(onProgressSceneId < this.props.scene.latestSceneid && onProgressSceneId > 0) {
                this.setState({showLive: true})    // display live tv button
            } else {
                this.setState({showLive: false})
            }
        });
    }

    // get current scene info by currentTime
    getOnProgressScene (curTime) {
        if(this.props.init && this.props.init.scenes && this.props.init.scenes.scenes.length > 0){
            let allScenes = this.props.init.scenes.scenes;
            let curScene = 0;
            for(let sc of allScenes) {
                if(sc.start < curTime && curTime < sc.end){
                    curScene = sc.sceneId;
                }
            }
            return curScene;
        }
    }

    async pressGoLiveTV () {
        console.log('press GoLive button......');
        let body;
        if(this.state.tempSharer) {
            body = {
                sid: this.state.tempSharer.sid,
                homeid: this.state.tempSharer.homeid
            };
        } else if(this.state.LeftBottomVideoSharer){
            body = {
                sid: this.state.LeftBottomVideoSharer.sid,
                homeid: this.state.LeftBottomVideoSharer.homeid
            };
        }else {
            body = {
                sid: this.props.app.sid,
                homeid: this.props.app.homeid
            };
        }
        let synchVideoData = await APIService.synchVideoOffset(body);
        if (synchVideoData.hasData && synchVideoData.data && synchVideoData.data.contentid) {
            this.state.currentPrimaryVideo = synchVideoData.data;
        }

        if(this.props.init.contentid !== this.state.currentPrimaryVideo.contentid) {
            globalEventEmitter.emit('resetLiveVideoMaxTime', 1);
            this.setState({
                initedLiveVideo: false,
                currentLiveVideo: this.state.currentPrimaryVideo.contentid,
                offset: this.state.currentPrimaryVideo.offset
            });
            this.props.init.globalMD = null;
            this.props.resetInitStateAction();
            this.props.hamburgerActions.Live_CurrentVideoName = this.state.currentPrimaryVideo.contentid;
        }

        this.refs.videoPlayerRef.checkIfPausedWhenSeek();
        if(this.state.offset >= 0) {
            this.refs.videoPlayerRef.player.seek(this.state.offset);
        }

        if(this.state.tempSharer) {
            this.props.synchScene(this.state.tempSharer, this.props.init, this.props.hamburgerActions)
        } else if(this.state.LeftBottomVideoSharer) {
            this.props.synchScene(this.state.LeftBottomVideoSharer, this.props.init, this.props.hamburgerActions)
        } else {
            this.props.synchScene(this.props.app, this.props.init, this.props.hamburgerActions);
        }
    }

    async onVideoPlayerLoad (e) {
        console.log('OnLoad.......');
        if(!this.state.initedLiveVideo) {  // when seek released, the video will call this method too
            this.setState({initedLiveVideo:true});
            console.log('onVideoPlayerLoad - this.state.offset : ' + this.state.offset);
            if(this.state.offset === 0) {
                await this.synchVideoFunc(-1);
            }
            if(this.state.offset >= 0) {
                this.refs.videoPlayerRef.player.seek(this.state.offset);
            } else {
                this.refs.videoPlayerRef.player.seek(this.state.start); // seek to current scene start time
            }
        }
    }

    onVideoPlayerEnd () {

    }


    onVideoPlayerProgress_ott (e) {
        // console.log(e);
        this.syncContentsWithScene_ott(e);
        this.props.currentOttOffset(e.currentTime);
    }

    onVideoPlayerLoad_ott(e) {
        // when update the video friend's shared
        if(!this.state.initedOttVideo) {
            this.setState({initedOttVideo: true});
            if(this.state.dropVideoOttOffset > 0){ // get into this page from 'home' or 'video list page'.
                this.refs.videoPlayerRef_Ott.player.seek(this.state.dropVideoOttOffset);
                this.setState({dropVideoOttOffset: 0});
            }
        }
    }

    syncContentsWithScene_ott (e) {
        let onProgressSceneId_ott = this.getOnProgressScene_ott(e.currentTime * 1000);
        if(onProgressSceneId_ott !== this.current_sceneid_ott && onProgressSceneId_ott > 0) {
            this.current_sceneid_ott = onProgressSceneId_ott;
            this._getCurrentContents(this.props.app, this.props.init, onProgressSceneId_ott, this.props.hamburgerActions.Recorded_CurrentVideoName);
        }
    }

    getOnProgressScene_ott (curTime) {
        if(this.props.init.scenes && this.props.init.scenes.scenes) {
            let allScenes =this.props.init.scenes.scenes;
            let curScene = 0;
            for(let sc of allScenes) {
                if(sc.start < curTime && curTime < sc.end){
                    curScene = sc.sceneId;
                }
            }
            return curScene;
        }
    }


    render() {
        return (
            <View style={styles.videoContainer} >
                { this.props.hamburgerActions.LeftTopVideoMode === 'Live'         && this.renderLiveVideoPlayer() }
                { this.props.hamburgerActions.LeftTopVideoMode === 'Recorded' && this.renderOttVideoPlayer()  }

                {/*{!this.state.synchSceneSucceed && this.renderLiveVideo_Disconnection()}*/}
            </View>
        )
    }


    /*------------- class - end --------------*/

}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: '#282828',
    },
    controls: {
        backgroundColor: "transparent",
        borderRadius: 5,
        position: 'absolute',
        bottom: 44,
        left: 4,
        right: 4,
    },
    videoContainer: {
        flex: 1,
    },
    renderOttSelectBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
    },
    renderOttSelectBox_none: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        opacity: 0,
    },
    selectBoxImage: {
        width: '100%',
        height: '100%',
        position: 'relative'
    },
    selectBoxText: {
        color: '#FFFFFF',
        textAlign: 'center',
        padding: 2,
        backgroundColor: 'transparent'
    },
    selectedImageBorder: {
        borderWidth: 2,
        borderColor: '#00B388',
    },
    selectedImageBorder_no: {
        borderWidth: 2,
        borderColor: 'transparent',
    },
    Playing: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 101
    },
    liveVideoUnavailable: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
    },
});


//---------------    container    -----------------
const mapStateToProps = state => ({
    init: state.init,
    app: state.app,
    scene: state.scene,
    OttVideo: state.OttVideo,
    hamburgerActions: state.hamburgerActions
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        synchScene, changeScene, getCurrentContents, getLatestScene, changeLoadingState, resetInitStateAction,
        switchComponent, currentHamburgerMarkAt, switchLiveCategoryVideo, navigateTo, setLeftTopVideoMode, switchRecordedCategoryVideo
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(LeftTop);