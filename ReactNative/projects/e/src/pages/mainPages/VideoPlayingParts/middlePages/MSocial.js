import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-native-spinkit'
import {jointChatRoom} from '../../../../actions/SocialActions'
import SocialMessage from './Social/SocialMessage';
import TwitterView from './Social/TwitterView';
import FacebookView from './Social/FacebookView';
import InstagramView from './Social/InstagramView';
import { AsyncStorage } from 'react-native';

import {  Linking } from 'react-native';


class MSocial extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentWillMount() {
        
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {
        
    }

    render() {
        let socialType = this.props.nav.params;
        if(!socialType) socialType = 'E3';
        return(
            <View style={styles.socialView}>
               {/* {  socialType === 'E3' &&  <View style={[styles.socialPart]}>
                    <SocialMessage socket = {this.props.socket}/>
                </View> }  */}
                 <View style={[styles.socialPart, socialType === 'E3' ? styles.showView : styles.hideView]}>
                    <SocialMessage socket = {this.props.socket}/>
                </View>
                <View style={[styles.socialPart, socialType === 'Twitter' ? styles.showView : styles.hideView]}>
                    <TwitterView/>
                </View>
                <View style={[styles.socialPart, socialType === 'Facebook' ? styles.showView : styles.hideView]}>
                   <FacebookView/>
                </View>
               
                <View style={[styles.socialPart, socialType === 'Instagram' ? styles.showView : styles.hideView]}>
                    <InstagramView/>
                </View>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    socialView: {
        flex: 1,
        backgroundColor: '#000',
        position: 'relative',
    },
    socialPart: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    showView: {
        top: 0,
        left: 0,
    },
    hideView: {
        display: 'none'
    },
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
export default connect(mapStateToProps, mapDispatchToProps)(MSocial);