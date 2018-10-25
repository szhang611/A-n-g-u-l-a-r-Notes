import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, PanResponder, Animated } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-native-spinkit'



class Favorites extends Component {
    constructor() {
        super();

        this.state = {
            pan: new Animated.ValueXY(),
            opacity: new Animated.Value(1),
        };

    }

    componentWillMount() {
        // Add a listener for the delta value change
        this._val = { x:0, y:0 };
        this.state.pan.addListener((value) => {this._val = value; console.log(value)});
        // Initialize PanResponder with move handling
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) => true,
            onPanResponderMove: Animated.event([
                null, { dx: this.state.pan.x, dy: this.state.pan.y }
            ]),
            onPanResponderRelease: (e, gesture) => {

                // if (this.isDropArea(gesture)) {
                //     Animated.timing(this.state.opacity, {
                //         toValue: 0,
                //         duration: 1000
                //     }).start(() =>
                //         this.setState({
                //             showDraggable: false
                //         })
                //     );
                // } else {
                    Animated.spring(this.state.pan, {
                        toValue: { x: 0, y: 0 },
                        friction: 30
                    }).start();
                // }

            },
        });
        // adjusting delta value
        this.state.pan.setValue({ x:0, y:0})
    }

    isDropArea(gesture) {
        console.log(gesture);
        return gesture.moveY > 10000;
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {

    }

    render() {
        const panStyle = {
            transform: this.state.pan.getTranslateTransform()
        };
        const opacityStyle = {
            opacity: this.state.opacity,
        }
        return(
            <View style={styles.FavoritesView}>

                <Animated.View
                    {...this.panResponder.panHandlers}
                    style={[panStyle, styles.circle, opacityStyle]}
                />

            </View>
        )
    }

}


const styles = StyleSheet.create({
    FavoritesView: {
        flex: 1,
    },
    circle: {
        backgroundColor: "skyblue",
        // width: 326.5,
        // height: 232.5,
    }
});



//---------- container ----------

const mapStateToProps = state => ({
    init: state.init,
    nav: state.nav,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({

    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(Favorites);