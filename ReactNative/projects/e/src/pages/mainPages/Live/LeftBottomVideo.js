import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-native-spinkit';

import AllUrls from '../../../services/APIUrl';
import { parseRes } from '../../../utils/Util';
import VideoPlayerLive from '../../../utils/video-player-live-mode/index';


class LeftBottomVideo extends Component {
    constructor() {
        super();

        this.state = {
            initedVideo: false,
            offset: 0,
            percentage: 1,  // in control bar
        }
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {

    }
    componentWillUnmount() {
        this.setState({initedVideo: false});
    }

    onVideoPlayerProgress(e) {
        // console.log(e);
        this.props.CurrentLiveOffset_leftBottom(e.currentTime);

        if(e.currentTime % 3 < 1 && e.currentTime > 1) {
            let offsetTime = this.synchVideoFunc(e.currentTime);
        }
    }

    // synchVideoFunc, get offset from the person who shared the video to me(current user).
    synchVideoFunc(currenttime) {
        let offsetTime;
        let body = {
            sid: this.props.videoContent.sharer.sid,
            homeid: this.props.videoContent.sharer.homeid
        };
        fetch(AllUrls.synchVideoUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        })
            .then((res)=>res.json())
            .then((res)=>{
                let synchVideoData = parseRes(res, 'synch', AllUrls.synchVideoUrl);
                if (synchVideoData.hasData) {
                    if(synchVideoData.data && synchVideoData.data.offset) {
                        offsetTime = Number(synchVideoData.data.offset);
                    }
                } else {
                    offsetTime = 0;
                }
                // console.log('currentTime: ' + currenttime);
                // console.log('offsetTime : ' + offsetTime);
                if(offsetTime > 0) {
                    this.setState({offset: offsetTime});
                }
                if(currenttime >0 && currenttime > offsetTime && offsetTime !== 0) {
                    // this.refs.videoPlayerRef_leftbottom.pauseIt();
                }
            },err=>{
                console.log(err);
            },()=>{})
    }

    onVideoPlayerLoad(e) {
        if(!this.state.initedVideo) {
            if(this.props.videoContent.video && this.props.videoContent.video.offset) {
                this.refs.videoPlayerRef_leftbottom.player.seek(this.props.videoContent.video.offset);
            }
            this.setState({initedVideo: true});
        }
    }

    onVideoPlayerEnd() {

    }

    pressGoLiveTV() {
        this.refs.videoPlayerRef_leftbottom.checkIfPausedWhenSeek();
        if(this.state.offset > 0) {
            this.refs.videoPlayerRef_leftbottom.player.seek(this.state.offset);
        }
        
        console.log('press GoLive button!');
    }


    render() {
        const _url = AllUrls.videoUri(this.props.videoContent.contentid);
        const posterUrl = AllUrls.videoThumbnailImage(this.props.videoContent.contentid, 1, 'thumbnail.jpg');

        return(
            <View style={styles.LeftBottomVideoView}>
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
                    percentage = {this.state.percentage}
                    moveableMaxTime = {this.state.end}
                    showLive = {true}
                    isLiveFullScreen = {this.state.isFullScreen}
                    ref = 'videoPlayerRef_leftbottom'
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
    init: state.init,
    hamburgerActions: state.hamburgerActions,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({

    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(LeftBottomVideo);