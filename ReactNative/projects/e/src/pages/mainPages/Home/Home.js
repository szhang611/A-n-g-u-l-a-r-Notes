import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, AlertIOS, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { switchComponent, currentHamburgerMarkAt } from '../../../actions/MainPageActions';
import { switchLiveCategoryVideo, switchRecordedCategoryVideo, setLeftTopVideoMode } from '../../../actions/CategoryAndVideoSwitchActions';
import { navigateTo } from '../../../actions/NavigationAction'
import { videoReceivedFromFriendShared } from '../../../actions/InitActions'


class Home extends Component {
    constructor(props) {
        super(props);
    }

    state = {

    };


    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.init.videoContent_ReceivedFromFriendShared && nextProps.init.videoContent_ReceivedFromFriendShared.contentid) {
            AsyncStorage.setItem('WATCHING_NOW', JSON.stringify({
                type: nextProps.init.videoContent_ReceivedFromFriendShared.video.type,
                content: nextProps.init.videoContent_ReceivedFromFriendShared.contentid
            }));

            let name = nextProps.init.videoContent_ReceivedFromFriendShared.video.type;
            if (name === 'OTT') {
                this.props.switchComponent('Recorded');
                this.props.switchRecordedCategoryVideo(nextProps.init.videoContent_ReceivedFromFriendShared.contentid, false, nextProps.init.videoContent_ReceivedFromFriendShared.video.offset);
                this.props.navigateTo('', '', 'Info', 'home');
                this.props.setLeftTopVideoMode('Recorded');
                this.props.currentHamburgerMarkAt('Recorded', false);
            } else if (name === 'Live') {
                this.props.switchComponent('Live');
                this.props.switchLiveCategoryVideo(nextProps.init.videoContent_ReceivedFromFriendShared.contentid, false, nextProps.init.videoContent_ReceivedFromFriendShared.video.offset);
                this.props.navigateTo('', '', 'Info', 'home');
                this.props.setLeftTopVideoMode('Live');
                this.props.currentHamburgerMarkAt('Live', false);
                let sharer = nextProps.init.videoContent_ReceivedFromFriendShared.sharer;
                AsyncStorage.setItem('tempStoreSharer_beforeNavigateToLivePlaying', JSON.stringify(sharer));
                nextProps.init.videoContent_ReceivedFromFriendShared = {};
            }

            this.props.videoReceivedFromFriendShared({}, -1);
        }
    }

    componentDidMount() {

    }


    render(){
        return(
            <View style={styles.homeView}>
                <TouchableOpacity>
                    <Text style={styles.homeMotto}>PwC / HPE</Text>
                    <Text style={styles.homeMotto}>Next Generation</Text>
                    <Text style={styles.homeMotto}>Media Advertising</Text>
                    <Text style={styles.homeMotto}>Platform</Text>
                </TouchableOpacity>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    homeView: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#202020',
    },
    homeMotto: {
        fontSize: 80,
        fontWeight: 'bold',
        lineHeight: 100,
        color: '#ffffff',
        textAlign: 'center',
    }
});

//---------------    container    -----------------
const mapStateToProps = state => ({
    init: state.init,
    app: state.app,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        switchComponent, currentHamburgerMarkAt, switchLiveCategoryVideo, navigateTo,
        switchRecordedCategoryVideo, setLeftTopVideoMode, videoReceivedFromFriendShared
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(Home);