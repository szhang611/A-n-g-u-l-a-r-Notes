import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, WebView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-native-spinkit'



class TwitterView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uriRoot : 'https://twitter.com/login?lang=en',
            // uriRoot : 'twitter.com/search?q=friendsTV',
            // uriRoot : 'https://www.google.com',
        }
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {

    }

    render() {
        return(
            <View style={{flex:1}}>
                {/* <WebView
                    source={{uri : this.state.uriRoot}}
                /> */}
                <Image  style={{flex:1,width: '98%',marginLeft:'1%',}} source={require('../../../../../assets/poster/Friends-Twitter-screenshot.png')} resizeMode='contain'/>
            </View>
        )

    }


}


const styles = StyleSheet.create({

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
export default connect(mapStateToProps, mapDispatchToProps)(TwitterView);