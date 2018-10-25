import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-native-spinkit';

import VideoPlayerOtt from '../../../../../utils/video-player-OTT-mode/index';
import AllUrls from '../../../../../services/APIUrl';


class LeftBottomVideo extends Component {
    constructor() {
        super();

        this.state = {
            initedVideo: false,
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

    onVideoPlayerProgress_ott(e) {
        // console.log(e);
        this.props.currentOttOffset(e.currentTime);
    }

    onVideoPlayerLoad_ott(e) {
        if(!this.state.initedVideo) {
            if(this.props.videoContent.video) {
                this.refs.videoPlayerRef.player.seek(this.props.videoContent.video.offset);
            }
            this.setState({initedVideo: true});
        }
    }

    render() {
        if(this.props.videoContent && this.props.videoContent.contentid) {

            const _url = this.props.videoContent.video.url;
            const posterUrl = this.props.videoContent.poster;

            return(
                <View style={styles.ViewingVideoVIew}>
                    <VideoPlayerOtt
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
                        hideCoverFullScreenIcon={true}
                        ref = 'videoPlayerRef'
                    />
                </View>
            )
        } else {
            return (<View />)
        }
    }

}


const styles = StyleSheet.create({
    ViewingVideoVIew: {
        flex: 1,
        backgroundColor: '#000',
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