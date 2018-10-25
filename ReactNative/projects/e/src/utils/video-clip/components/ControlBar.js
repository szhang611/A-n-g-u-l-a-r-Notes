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
        this.props.callback(ct);
    }

    propTime = 0;

    displayControlBar () {
        const {
            onSeek,
            onSeekRelease,
            progress,
            buffered,
            currentTime,
            duration,
            muted,
            paused,
            fullscreen,
            theme,
            inlineOnly,
            showLive,
            isLiveFullScreen,
            displayFullScreenIcon,
        } = this.props;

        //  -----  original seek -- start --
        seekToPrevious = () => {
            const seekk = (currentTime - 10 > 0) ? currentTime - 10 : 0;
            return seekk/duration;
        };
        seekToNext = () => {
            const seekk = (currentTime + 10 > duration) ? duration : currentTime + 10;
            return seekk/duration;
        };
        //  -----  original seek -- end   --

        return (
            <LinearGradient colors={['rgba(0,0,0,0)']} style={styles.container}>
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
                <Time time={currentTime} theme={theme.seconds} />
                <Scrubber
                    onSeek={pos => onSeek(pos)}
                    onSeekRelease={pos => onSeekRelease(pos)}
                    // progress={1}
                    progress={progress}
                    buffered={buffered}
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
                <Time time={duration} theme={theme.duration} />
                { displayFullScreenIcon &&
                <ToggleIcon
                    paddingRight
                    onPress={() => this.props.toggleFS()}
                    iconOff="fullscreen"
                    iconOn="fullscreen-exit"
                    isOn={isLiveFullScreen}
                    theme={theme.fullscreen}
                />}
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
  onSeek: PropTypes.func.isRequired,
  onSeekRelease: PropTypes.func.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  muted: PropTypes.bool.isRequired,
    paused: PropTypes.bool.isRequired,
  inlineOnly: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  buffered: PropTypes.number,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
    togglePlay: PropTypes.func,
    showLive: PropTypes.bool,
    displayFullScreenIcon: PropTypes.bool,
}

export { ControlBar }
