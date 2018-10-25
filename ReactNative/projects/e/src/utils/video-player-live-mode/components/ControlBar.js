import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, AlertIOS } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { ToggleIcon, Time, Scrubber } from './'

const styles = StyleSheet.create({
  container: {
      flexDirection: 'row',
      height: 35,
      alignSelf: 'stretch',
      justifyContent: 'flex-end',
      borderColor: 'transparent'
  },
    TextColor: {
      color: '#FFFFFF',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

class ControlBar extends Component {
    componentWillMount() {
        const ct = this.props.currentTime? this.props.currentTime: 1;
        // this.props.callback(ct);
    }

    propTime = 0;

    displayControlBar () {
        const {
            onSeek,
            onSeekRelease,
            progress,
            currentTime,
            duration,
            muted,
            paused,
            fullscreen,
            theme,
            inlineOnly,
            percentage,
            moveableMaxTime,
            showLive,
            isLiveFullScreen,
        } = this.props;


        seekToPrevious = () => {
            let seekk;
            if(currentTime - 10 > 0) {
                seekk = currentTime - 10;
            } else {
                seekk = 0;
            }

            if(this.propTime === 0 || currentTime >= this.propTime) {
                this.propTime = currentTime;
            }

            console.log('this.props.callback(this.propTime); seekToPrevious!!!  ' + this.propTime);
            this.props.callback(this.propTime);
            return seekk/this.propTime;
        };

        seekToNext = () => {
            if(currentTime < moveableMaxTime) {
                const seekk = (currentTime + 10 > moveableMaxTime) ? moveableMaxTime : currentTime + 10;
                // console.log('seekk : ' + seekk);
                // console.log('currentTime : ' + currentTime);
                // console.log('moveableMaxTime : ' + moveableMaxTime);
                // console.log('this.propTime : ' + this.propTime);
                if(this.propTime === 0 || currentTime + 10 > this.propTime) {
                    this.propTime = seekk;
                }
                this.props.callback(this.propTime);
                return seekk/this.propTime;
            } else {
                return 100;
            }
        };

        //  -----  original seek -- start --
        // seekToPrevious = () => {
        //     const seekk = (currentTime - 10 > 0) ? currentTime - 10 : 0;
        //     return seekk/duration;
        //     // should return a percent
        // };
        // seekToNext = () => {
        //     // const seekk = (currentTime + 10 > duration) ? duration : currentTime + 10;
        //     const seekk = (currentTime + 10 > moveableMaxTime) ? moveableMaxTime : currentTime + 10;
        //     return seekk/duration;
        // };
        //  -----  original seek -- end   --

        return (
            <LinearGradient colors={['rgba(0,0,0,0)']} style={styles.container}>
                {showLive && <ToggleIcon
                    paddingLeft
                    theme={theme.volume}
                    onPress={()=>{this.props.pressGoLiveTV()}}
                    isOn={true}
                    iconOff="live-tv"
                    iconOn="live-tv"
                    size={20}
                />}
                <ToggleIcon
                    paddingLeft
                    // paddingRight
                    theme={theme.volume}
                    onPress={() => {onSeekRelease(seekToPrevious())}}
                    isOn={true}
                    iconOff="replay-10"
                    iconOn="replay-10"
                    size={20}
                />
                <ToggleIcon
                    paddingLeft
                    paddingRight
                    theme={theme.volume}
                    onPress={() => {this.props.togglePlay()}}
                    isOn={paused}
                    iconOff="pause-circle-outline"
                    iconOn="play-circle-outline"
                    size={20}
                />
                <ToggleIcon
                    // paddingLeft
                    paddingRight
                    theme={theme.volume}
                    onPress={() => {onSeekRelease(seekToNext())}}
                    isOn={true}
                    iconOff="forward-10"
                    iconOn="forward-10"
                    size={20}
                />
                <Time time={0} theme={theme.seconds} />
                {/*<Time time={currentTime} theme={theme.seconds} />*/}
                <Scrubber
                    onSeek={pos => onSeek(pos)}
                    onSeekRelease={pos => onSeekRelease(pos)}
                    // progress={1}
                    progress={progress}
                    theme={{ scrubberThumb: theme.scrubberThumb, scrubberBar: theme.scrubberBar }}
                />
                <ToggleIcon
                    paddingLeft
                    theme={theme.volume}
                    onPress={() => this.props.toggleMute()}
                    isOn={muted}
                    iconOff="volume-up"
                    iconOn="volume-mute"
                    size={20}
                />
                <Time time={currentTime} theme={theme.duration} />
                {/*<Time time={duration} theme={theme.duration} />*/}
                <ToggleIcon
                    paddingRight
                    onPress={() => this.props.toggleFS()}
                    iconOff="fullscreen"
                    iconOn="fullscreen-exit"
                    isOn={isLiveFullScreen}
                    theme={theme.fullscreen}
                />
            </LinearGradient>
        )
    }

    render(){
          return this.displayControlBar()
    }
}

ControlBar.propTypes = {
  toggleFS: PropTypes.func.isRequired,
  toggleMute: PropTypes.func.isRequired,
    pressGoLiveTV: PropTypes.func,
  onSeek: PropTypes.func.isRequired,
  onSeekRelease: PropTypes.func.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  muted: PropTypes.bool.isRequired,
    paused: PropTypes.bool.isRequired,
  inlineOnly: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
    percentage: PropTypes.number,
    moveableMaxTime: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    togglePlay: PropTypes.func,
    showLive: PropTypes.bool,
}

export { ControlBar }
