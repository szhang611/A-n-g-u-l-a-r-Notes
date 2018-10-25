import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-native-spinkit';

import VideoPlayerLeftBottom from '../../../utils/video-player-OTT-mode/index';
import AllUrls from '../../../services/APIUrl';

import { getLeftBottomCurrentContents } from '../../../actions/SceneActions';
import { globalEventEmitter } from '../../../utils/globalEventEmitter';


class LeftBottomVideo extends Component {
    constructor() {
        super();

        this.state = {
            initedVideo: false,
        };
        this.current_sceneid = 1;
        this.leftTopIsPlaying = false;
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {
        globalEventEmitter.addListener('startLeftTopPlaying', ()=>{
            this.refs.VideoPlayerLeftBottomRef.pauseIt();
            this.leftTopIsPlaying = true;
        })
        globalEventEmitter.addListener('stopLeftTopPlaying', ()=>{
            this.leftTopIsPlaying = false;
        })
    }
    
    componentWillUnmount() {
        this.setState({initedVideo: false});

        globalEventEmitter.emit('stopLeftBottomPlaying', 0);
        AsyncStorage.setItem('NowPlayingLeftBottom', 'No');
    }


    doInit() {
        if(this.props.videoContent.video) {
            this.props.getLeftBottomCurrentContents(this.props.app, this.props.init, 1, this.props.videoContent.contentid);
            this.refs.VideoPlayerLeftBottomRef.player.seek(this.props.videoContent.video.offset);
        }
        this.setState({initedVideo: true});
    }

    //  load
    onVideoPlayerLoad_ott() {
        if(!this.state.initedVideo) {
            this.doInit();
        }
        globalEventEmitter.emit('startLeftBottomPlaying', 1);
        AsyncStorage.setItem('NowPlayingLeftBottom', 'Yes');
    }

    // progress
    onVideoPlayerProgress_ott(e) {
        // console.log(e);
        this.props.currentOttOffset(e.currentTime);
        if(!this.state.initedVideo) {
            this.doInit();
        }

        // get left bottom products, new action
        this.syncContentsWithScene(e);
    }
    
    syncContentsWithScene (e) {
        let onProgressSceneId = this.getOnProgressScene(e.currentTime * 1000);
        if(onProgressSceneId !== this.current_sceneid && onProgressSceneId > 0) {
            this.current_sceneid = onProgressSceneId;
            this.props.getLeftBottomCurrentContents(this.props.app, this.props.init, onProgressSceneId, this.props.videoContent.contentid);
        }
    }

    getOnProgressScene (curTime) {
        if(this.props.init.leftBottomScenes && this.props.init.leftBottomScenes.scenes) {
            let allScenes =this.props.init.leftBottomScenes.scenes;
            let curScene = 0;
            for(let sc of allScenes) {
                if(sc.start < curTime && curTime < sc.end){
                    curScene = sc.sceneId;
                }
            }
            return curScene;
        } else {
            return this.current_sceneid;
        }
    }

    onPlayOTT = (val)=>{
        if(val) {
            globalEventEmitter.emit('startLeftBottomPlaying', 1);
            AsyncStorage.setItem('NowPlayingLeftBottom', 'Yes');
            if(this.leftTopIsPlaying){
                this.props.getLeftBottomCurrentContents(this.props.app, this.props.init, this.current_sceneid, this.props.videoContent.contentid);
            }
        } else {
            globalEventEmitter.emit('stopLeftBottomPlaying', 0);
        }
    };

    render() {
        const _url = AllUrls.videoUri(this.props.videoContent.contentid);
        const posterUrl = AllUrls.videoThumbnailImage(this.props.videoContent.contentid, 1, 'thumbnail.jpg');

        return(
            <View style={styles.LeftBottomVideoView}>
                <VideoPlayerLeftBottom
                    autoPlay={true}
                    url={_url}
                    poster = {posterUrl}
                    // toggleFullScreen={() => this.onFullScreen()}
                    onProgress={this.onVideoPlayerProgress_ott.bind(this)}
                    onLoad={this.onVideoPlayerLoad_ott.bind(this)}
                    rotateToFullScreen = {false}
                    showLive = {false}
                    style={{flex:1}}
                    // isLiveFullScreen = {this.state.isFullScreen}
                    displayFullScreenIcon={false}
                    onPlay={this.onPlayOTT.bind(this)}
                    hideCoverFullScreenIcon={true}
                    ref = 'VideoPlayerLeftBottomRef'
                />
            </View>
        )
    }

}


const styles = StyleSheet.create({
    LeftBottomVideoView: {
        flex: 1,
        backgroundColor: '#282828',
    },
});



//---------- container ----------

const mapStateToProps = state => ({
    app: state.app,
    init: state.init,
    hamburgerActions: state.hamburgerActions,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        getLeftBottomCurrentContents
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(LeftBottomVideo);