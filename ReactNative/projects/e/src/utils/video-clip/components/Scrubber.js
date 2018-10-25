import React, { Component } from 'react'

import PropTypes from 'prop-types'
import {
  View,
  Platform,
  StyleSheet,
  Slider as RNSlider,
  PanResponder,
  TouchableHighlight,
  Animated
} from 'react-native'
import Slider from 'react-native-slider'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    right: 5,
    height: 25
  },
  slider: {
    marginHorizontal: -10
  },
  thumbStyle: {
    width: 15,
    height: 15
  },
  trackStyle: {
    borderRadius: 1
  }
})

class Scrubber extends Component{

  constructor(props) {
    super(props)
    this.state ={
      width : 0,
    }
   
  }
  
  componentWillMount(){

    
    this.animatedValue = new Animated.ValueXY()
    this.panResponder = PanResponder.create({
        onStartShouldSetResponder: (evt, gestureState) => true ,
        onMoveShouldSetResponder: (evt, gestureState) => true, 
        onResponderGrant: (e, gestureState) => {

        },
        onResponderMove:  Animated.event([
          null, {dx : this.animatedValue.x, dy: this.animatedValue.y}
        ]),
        onResponderRelease: (e , gestureState)=>{

        }
     })

  }

  render() { 
    let {
      progress,
      buffered,
      onSeek,
      onSeekRelease
    } = this.props
   
    const animatedStyle = {
       transform: this.animatedValue.getTranslateTransform()
    }
    
    return (

      <TouchableHighlight  style={styles.container}   onLayout={(event) => {
        var {x, y, width, height} = event.nativeEvent.layout;
   
        this.setState({width})
      }}  onPress={(e) => { console.log("onPress")
         progress =  e.nativeEvent.locationX / this.state.width
         onSeek(progress)
         onSeekRelease(progress)
    } }>
      <View style={{marginTop: 2}}>
          {/* <Slider
            onValueChange={val => onSeek(val)}
            onSlidingComplete={val => onSeekRelease(val)}
            value={progress === Number.POSITIVE_INFINITY ? 0 : progress}
            thumbTintColor={theme.scrubberThumb}
            thumbStyle={styles.thumbStyle}
            trackStyle={styles.trackStyle}
            minimumTrackTintColor={theme.scrubberBar}
            maximumTrackTintColor={trackColor}
            trackClickable
          /> */}

          <View  style={{position:'absolute', left: 5,  justifyContent: 'center', marginRight: 70,  width: '100%', height: 8, backgroundColor: '#afb0b3f0' , zIndex : 1, borderRadius: 4,}} />
          <View style={{position:'absolute', left: 5,   justifyContent: 'center', marginRight: 70, width: (progress === Number.POSITIVE_INFINITY ? 0 : progress ) * 100 + '%', height: 8, backgroundColor: '#cbcdd0de' ,zIndex : 3, borderRadius: 4, }} />
          <View style={{position:'absolute', left: 5,  justifyContent: 'center', marginRight: 70, width: (buffered? buffered: 0) * 100 + '%', height: 8, backgroundColor: '#888b8ede', zIndex : 2, borderRadius: 4, }} />
          <Animated.View style={[{position:'absolute',  justifyContent: 'center',left: (progress === Number.POSITIVE_INFINITY ? 0 : progress ) * 100 + '%', marginRight: 70, width: 12, height: 12, borderRadius: 6 , borderColor: '#fff', backgroundColor: 'white', zIndex : 4, top: -2, }, animatedStyle ]}
          {...this.panResponder.panHandlers}
          />
          
          {/* <Slider
          value={buffered === Number.POSITIVE_INFINITY ? 0 : buffered}
          thumbTintColor={theme.scrubberThumb}
          thumbStyle={styles.thumbStyle}
          trackStyle={styles.trackStyle}
          minimumTrackTintColor={theme.scrubberBar}
          maximumTrackTintColor={trackColor}
        /> */}
      </View>
      </TouchableHighlight>

    )
  }
}

Scrubber.propTypes = {
  onSeek: PropTypes.func.isRequired,
  onSeekRelease: PropTypes.func.isRequired,
  progress: PropTypes.number.isRequired,
  buffered: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
}

export { Scrubber }
