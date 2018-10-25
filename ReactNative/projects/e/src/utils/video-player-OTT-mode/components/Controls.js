import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Animated,
  StyleSheet,
    AlertIOS,
  TouchableWithoutFeedback as Touchable,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native'
import {
  PlayButton,
  ControlBar,
  Loading,
  TopBar,
  ProgressBar
} from './'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import urls from '../../../services/APIUrl';
import { chooseProduct } from '../../../actions/ProductActions';
import { navigateTo } from '../../../actions/NavigationAction';
import { globalTabSwitchState, globalEventEmitter } from '../../globalEventEmitter';


class Controls extends Component {
  constructor() {
    super()
    this.state = {
      hideControls: false,
      seconds: 0,
      seeking: false,
        products: null,
        content: ''
    }
    this.animControls = new Animated.Value(1)
    this.scale = new Animated.Value(1)
    this.progressbar = new Animated.Value(2)
  }

  componentWillMount() {
      if (this.props.init.products) {
          this.setState({
              products: this.props.init.products,
              content: this.props.init.contentid
          });
      }
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.init.products) {
          this.setState({
              products: nextProps.init.products,
              content: nextProps.init.contentid
          });
      }
  }

  componentDidMount() {
    this.setTimer()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  onSeek(pos) {
    this.props.onSeek(pos)
    if (!this.state.seeking) {
      this.setState({ seeking: true })
    }
  }

  onSeekRelease(pos) {
    this.props.onSeekRelease(pos)
    this.setState({ seeking: false, seconds: 0 })
  }

  setTimer() {
    this.timer = setInterval(() => {
      switch (true) {
        case this.state.seeking:
          // do nothing
          break
        case this.props.paused:
          if (this.state.seconds > 0) this.setState({ seconds: 0 })
          break
        case this.state.hideControls:
          break
        case this.state.seconds > 3:
          this.hideControls()
          break
        default:
          this.setState({ seconds: this.state.seconds + 1 })
      }
    }, 1000)
  }

  showControls() {
    this.setState({ hideControls: false }, () => {
      this.progressbar.setValue(2)
      Animated.parallel([
        Animated.timing(this.animControls, { toValue: 1, duration: 200 }),
        Animated.timing(this.scale, { toValue: 1, duration: 200 })
      ]).start()
    })
  }

  hideControls() {
    Animated.parallel([
      Animated.timing(this.animControls, { toValue: 0, duration: 200 }),
      Animated.timing(this.scale, { toValue: 0.25, duration: 200 })
    ]).start(() => this.setState({ hideControls: true, seconds: 0 }))
  }

  hiddenControls() {
    Animated.timing(this.progressbar, { toValue: 0, duration: 200 }).start()
    return (
      <Touchable style={styles.container} onPress={() => this.showControls()}>
        <Animated.View style={[styles.container, { paddingBottom: this.progressbar }]}>
          <ProgressBar theme={this.props.theme.progress} progress={this.props.progress} />
        </Animated.View>
      </Touchable>
    )
  }

  loading() {
    return (
      <View style={styles.container}>
        {/*<Loading theme={this.props.theme.loading} />*/}
      </View>
    )
  }

    transferMaxTime = (val) => {
      this.props.callback(val);
    }

  displayedControls() {
    const {
      paused,
      fullscreen,
      muted,
      loading,
      logo,
      more,
      onMorePress,
      title,
      progress,
      buffered,
      currentTime,
      duration,
      theme,
      inlineOnly,
        showLive,
        isLiveFullScreen,
        displayFullScreenIcon,
        displayEditIcon,
    } = this.props

    const { center, ...controlBar } = theme



    return (
      <Touchable onPress={() => this.hideControls()} onPressIn={this.addOne} onPressOut={this.stopTimer}>
        <Animated.View style={[styles.container, { opacity: this.animControls }]}>
          <TopBar
            title={title}
            logo={logo}
            more={more}
            onMorePress={() => onMorePress()}
            theme={{ title: theme.title, more: theme.more }}
            displayFullScreenIcon={displayFullScreenIcon}
            displayEditIcon={displayEditIcon}
            pressEditIcon={()=>this.props.pressEditIcon()}
          />
          <Animated.View style={[styles.flex, { transform: [{ scale: this.scale }] }]}>
            <PlayButton
              onPress={() => this.props.togglePlay()}
              paused={paused}
              loading={loading}
              theme={center}
            />
          </Animated.View>
          <ControlBar
            toggleFS={() => this.props.toggleFS()}
            toggleMute={() => this.props.toggleMute()}
            togglePlay={() => this.props.togglePlay()}
            muted={muted}
            paused={paused}
            fullscreen={fullscreen}
            onSeek={pos => this.onSeek(pos)}
            onSeekRelease={pos => this.onSeekRelease(pos)}
            progress={progress}
            buffered= {buffered}
            currentTime={currentTime}
            duration={duration}
            theme={controlBar}
            inlineOnly={inlineOnly}
            showLive={showLive}
            callback={this.transferMaxTime.bind(this)}
            isLiveFullScreen={isLiveFullScreen}
            displayFullScreenIcon={displayFullScreenIcon}
          />
            {isLiveFullScreen && this.props.init.products &&
            <View style={styles.ImageBox}>
              <View style={styles.ImageBoxMask}></View>
                {/*<ScrollView horizontal={true}>*/}
                  { this.renderProductsImages(this.state.products) }
                {/*</ScrollView>*/}
            </View>
            }
        </Animated.View>
      </Touchable>
    )
  }

    addOne() {
        console.log('ON PRESS IN');
        // this.setState({number: this.state.number+1});
        // this.timer = setTimeout(this.addOne, 200);
    }

    stopTimer() {
        console.log('ON PRESS OUT');
        // clearTimeout(this.timer);
    }

  chooseProduct(idx){
      this.props.chooseProduct(this.props.init, idx);
      this.props.navigateTo('Shop','Home','Shop','productDetails');
      this.props.toggleFS();

      globalTabSwitchState.shop = true;
      globalEventEmitter.emit('tabSwitchStatus_OtherEmit', globalTabSwitchState);
  }

  renderProductsImages = (products) => {
      let HOST = urls.CDN_old + this.state.content + '/static/';
      let imageUris = [];
      let images = [];
      if (products && products.length > 0) {
          imageUris = products.map((item) => {
              return HOST + item.poster;
          })
      }
      images = imageUris.map((uri, i) => {
          return (
              <TouchableOpacity key={i} style={styles.productsImageWrap} onPress={() => {this.chooseProduct(i + 1) }}>
                <Image source={{ uri: uri }} resizeMode='contain' style={styles.productImages} />
              </TouchableOpacity>
          )
      })
      return images;
  }


    render() {
    // if (this.props.loading) return this.loading()
    const {
      buffered,
      currentTime
    } = this.props
    if (this.state.hideControls) {
      return this.hiddenControls()
    }
    return this.displayedControls()
  }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 99
    },
    flex: {
        flex: 1
    },
    ImageBox: {
        height: 100,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        flexDirection:'row',
    },
    ImageBoxMask: {
        backgroundColor: '#f1f1f1',
        opacity: 0.6,
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '100%',
        height: 100,
    },
    productsImageWrap: {
        width: '10%',
        height: 84,
        marginLeft: 10,
        marginTop: 8,
        marginBottom: 8,
    },
    productImages: {
        width: '100%',
        height: '100%',
    },
})


Controls.propTypes = {
  toggleFS: PropTypes.func.isRequired,
  toggleMute: PropTypes.func.isRequired,
  togglePlay: PropTypes.func.isRequired,
  onSeek: PropTypes.func.isRequired,
  onSeekRelease: PropTypes.func.isRequired,
  onMorePress: PropTypes.func.isRequired,
  paused: PropTypes.bool.isRequired,
  inlineOnly: PropTypes.bool.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  muted: PropTypes.bool.isRequired,
  more: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  buffered: PropTypes.number,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  title: PropTypes.string,
  logo: PropTypes.string,
  theme: PropTypes.object.isRequired,
  showLive: PropTypes.bool,
    isLiveFullScreen: PropTypes.bool,
    displayFullScreenIcon: PropTypes.bool,
    displayEditIcon: PropTypes.bool,
    pressEditIcon: PropTypes.func,
}

// export { Controls }

const mapStateToProps = state => ({
    init: state.init,
    app: state.app,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        chooseProduct, navigateTo
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(Controls);
