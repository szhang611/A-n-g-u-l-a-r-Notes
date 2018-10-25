import React, { Component } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, AsyncStorage, WebView, Alert
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icons from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';

import { APIService } from '../../../services/APIService';
import urls from '../../../services/APIUrl';
import { getVideoQueue } from '../../../actions/SocialActions';
import { toHHMMSS } from '../../../utils/Util';

import { switchLiveCategoryVideo, switchRecordedCategoryVideo, setLeftTopVideoMode } from '../../../actions/CategoryAndVideoSwitchActions';
import { switchComponent, currentHamburgerMarkAt } from '../../../actions/MainPageActions';
import { navigateTo } from '../../../actions/NavigationAction';
import { videoReceivedFromFriendShared } from '../../../actions/InitActions';



class Saved extends Component {
    constructor() {
        super();

        this.state = {
            savedList: [],
            displaySaved: false,
            userId: '',
        };
    }

    componentWillMount() {
        AsyncStorage.getItem('USER_ID').then((uid)=>{
            this.setState({userId : uid});
            this.getSavedList(uid);
        });
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
                this.props.videoReceivedFromFriendShared(nextProps.init.videoContent_ReceivedFromFriendShared.contentid, false, nextProps.init.videoContent_ReceivedFromFriendShared.video.offset);
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


    playVideo(item) {
        console.log(item);
        if(item.video && item.video.type === 'OTT') {
            AsyncStorage.setItem('WATCHING_NOW', JSON.stringify({
                type: item.video.type,
                content: item.contentid
            }));
            // navigate to OTT play
            this.props.switchComponent('Recorded');
            this.props.switchRecordedCategoryVideo(item.contentid, false, item.video.offset);
            this.props.navigateTo('', '', 'Info', 'home');
            this.props.setLeftTopVideoMode('Recorded');
            this.props.currentHamburgerMarkAt('Recorded', false);
        }
    }

    async getSavedList(uid) {
        let res = await APIService.getShareRequests(uid).catch(err=>{console.log(err);return;});
        // console.log(res);
        if(res){
            this.setState({
                savedList: res,
                displaySaved: true
            });
        } else {
            this.setState({
                savedList: [],
                displaySaved: false
            });
        }
    }

    renderSaved() {
        if(this.state.savedList && this.state.savedList.length > 0) {
            return this.state.savedList.map((item, idx)=>{
                // console.log(item);
                return (
                    <View style={styles.savedWrapper} key={idx}>
                        <TouchableOpacity style={styles.savedImagePart} onPress={()=>{this.playVideo(item.content)}}>
                            <Image style={styles.savedImageImage}
                                   resizeMode='cover'
                                   source={{ uri: `${urls.CDN_old}/${item.content.contentid}/1/static/thumbnail.jpg`}}
                                   defaultSource={require( '../../../assets/logo/pwc_logo_2.png')}
                            />
                            <View style={styles.savedImagePartIcon}>
                                <Icons style={styles.savedImageIcon} name={'play-circle-outline'} size={60} color={'#FFFFFF'}/>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.rightDescription}>
                            <Text style={styles.rightText}>{item.content.contentid}</Text>
                            {item.sharedBy !== this.state.userId && <Text style={styles.rightText}>{ 'Shared by: '  + item.sharedBy }</Text>}
                            {item.sharedBy !== this.state.userId && <Text style={styles.rightText}>{ item.sharedTime }</Text>}

                            {item.sharedBy === this.state.userId && <Text style={styles.rightText}>You saved</Text>}
                            {item.sharedBy === this.state.userId && <Text style={styles.rightText}>Offset: { toHHMMSS(item.offset) }</Text>}
                        </View>
                    </View>
                )
            });
        }
    }

    render() {
        return(
            <View style={styles.savedView}>
                <View style={styles.titleBar}>
                    <Text style={styles.savedBoxTitle}>Saved videos</Text>
                </View>
                <View style={styles.savedViewBody}>
                    {
                        this.state.displaySaved &&
                            <ScrollView>
                                <View style={styles.inScrollView}>
                                    {
                                        this.renderSaved()
                                    }
                                </View>
                            </ScrollView>
                    }
                    {
                        !this.state.displaySaved &&
                        <View>
                            <Text style={styles.noticeText}>No saved videos.</Text>
                        </View>
                    }
                </View>
            </View>
        )
    }

}



const styles = StyleSheet.create({
    savedView: {
        flex: 1,
        position: 'relative',
    },
    titleBar: {
        flex: 1,
        justifyContent:'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#101010',
    },
    savedBoxTitle: {
        color: '#FFFFFF',
        fontSize: 40,
    },
    savedViewBody: {
        flex: 10,
        zIndex: 2,
    },
    inScrollView: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    noticeText: {
        color: '#FFF',
        fontSize: 16,
        padding: 15,
    },
    savedWrapper: {
        height: 150,
        width: '33%',
        flexDirection: 'row',
    },
    savedImagePart: {
        flex: 1,
        height: 150,
        justifyContent: 'center',
        alignItems: 'flex-start',
        position: 'relative',
        paddingLeft: 10,
    },
    savedImageImage: {
        width: '100%',
        maxWidth: 130,
        height: 130,
    },
    savedImagePartIcon: {
        position: 'absolute',
        top: 0,
        left: 45,
        height: 150,
        justifyContent: 'center',
    },
    savedImageIcon: {
        backgroundColor: 'transparent',
    },
    savedWebView: {
        zIndex: 3,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    rightDescription: {
        position: 'absolute',
        top: 10,
        left: 150,
    },
    rightText: {
        color: '#FFF',
    }
});



//---------- container ----------

const mapStateToProps = state => ({
    init: state.init,
    nav: state.nav,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        getVideoQueue,
        switchLiveCategoryVideo, switchRecordedCategoryVideo, setLeftTopVideoMode,
        switchComponent, currentHamburgerMarkAt, navigateTo, videoReceivedFromFriendShared,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(Saved);