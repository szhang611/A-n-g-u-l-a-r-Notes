import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, AlertIOS, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AsyncStorage } from 'react-native';
import { globalEventEmitter } from '../../../utils/globalEventEmitter';

import { switchComponent, currentHamburgerMarkAt } from '../../../actions/MainPageActions';
import { switchLiveCategoryVideo, switchRecordedCategoryVideo, setLeftTopVideoMode } from '../../../actions/CategoryAndVideoSwitchActions';
import RecordedPlaying from './RecordedPlaying';
import { navigateTo } from '../../../actions/NavigationAction';
import { videoReceivedFromFriendShared } from '../../../actions/InitActions';

import AllUrls from '../../../services/APIUrl';
import poster_bigbuckbunny from '../../../assets/poster/poster_bigbuckbunny.jpg';
import poster_sintal from '../../../assets/poster/poster_sintel.jpg';
class Recorded extends Component {
    constructor() {
        super();
    }

    state = {
        displayVideoCategories: true,
    };


    componentWillMount() {
        // this.props.hamburgerActions.Recorded_CategoryToVideo = true;
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.hamburgerActions.Recorded_CategoryToVideo && nextProps.init.videoContent_ReceivedFromFriendShared && nextProps.init.videoContent_ReceivedFromFriendShared.contentid) {
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
            if(nextProps.init.videoContent_ReceivedFromFriendShared.contentid){
                globalEventEmitter.emit('sharedVideoFromFriend', nextProps.init.videoContent_ReceivedFromFriendShared);
            }

            this.props.videoReceivedFromFriendShared({}, -1);
        }
    }

    componentDidMount() {

    }

    renderImageBox1() {
        let imageBox = [];
        let imageName = [
            {
                name: 'Friends-701',
                uri: AllUrls.videoThumbnailImage('Friends-701', 1, 'thumbnail.jpg'),
            },
            {
                name: 'ChefsTable-104',
                uri: AllUrls.videoThumbnailImage('ChefsTable-104', 1, 'thumbnail.jpg'),
            },
            {
                name: 'Big Buck Bunny',
                uri: poster_bigbuckbunny,
            },
            {
                name: 'Sintel',
                uri: poster_sintal,
            },
            {
                name: 'Bruce Willis',
                uri: `https://i.ytimg.com/sh/wBRu2SHE4ljZvzh_sZDfvA/market_sd.jpg`,
            },
            {
                name: 'The Venture Bros',
                uri: `https://i.ytimg.com/sh/7p-h-Cqe8DqHQbxxYclRyw/market_sd.jpg`,
            },
            {
                name: 'YellowStone',
                uri: `https://i.ytimg.com/sh/ZC5U55d2X785YMonG7yjJA/market_sd.jpg`,
            },
            {
                name: 'Better Call Saul',
                uri: `https://i.ytimg.com/sh/xGG4KAzSXt2hXN9v3tTG5A/market_sd.jpg`,
            },
        ];
        imageBox = imageName.map((item, idx)=>{
            if(idx === 2 || idx === 3) {
                return (
                    <TouchableOpacity style={styles.imageBox} key={idx} onPress={()=>{this.toWatchVideo(item.name)}}>
                        <Image style={styles.thumbnailImage} resizeMode='contain' source={item.uri} defaultSource={require('../../../assets/logo/pwc_logo_2.png')}/>
                        <Text style={styles.imageBox_text}>{item.name}</Text>
                    </TouchableOpacity>
                )
            } else {
                return (
                    <TouchableOpacity style={styles.imageBox} key={idx} onPress={()=>{this.toWatchVideo(item.name)}}>
                        <Image style={styles.thumbnailImage} resizeMode='contain' source={{uri: item.uri}} defaultSource={require('../../../assets/logo/pwc_logo_2.png')}/>
                        <Text style={styles.imageBox_text}>{item.name}</Text>
                    </TouchableOpacity>
                )
            }
        });
        return imageBox;
    }

    renderImageBox2() {
        let imageBox = [];
        let imageName = [
            {
                name: 'Game of Thrones',
                uri: `https://i.ytimg.com/sh/ow8-ZftRoZelY710tvO45Q/market_sd.jpg`,
            },
            {
                name: 'Killing Eve',
                uri: `https://i.ytimg.com/sh/pVbNUD8B-lMLaljDXqlMpA/market_sd.jpg`,
            },
            {
                name: 'American Horror Story',
                uri: `https://i.ytimg.com/sh/n17ix3mJ3I79R415NsL78w/market_sd.jpg`,
            },
            {
                name: 'Chesapeake Shores',
                uri: `https://i.ytimg.com/sh/cWQ7eyspTW7Hg7Nc1LsJYQ/market_sd.jpg`,
            },
            {
                name: 'Pose',
                uri: `https://i.ytimg.com/sh/0gBx_fE6W7HBrMytWsQvwA/market_sd.jpg`,
            },
            {
                name: 'The Hills: That Was Then, This Is Now',
                uri: `https://i.ytimg.com/sh/NsS_K0amd-21_RjFkV5_gg/market_sd.jpg`,
            },
            {
                name: 'Psych: the Movie',
                uri: `https://i.ytimg.com/sh/REwrfrzFdJzrh3DwiLKmbg/market_sd.jpg`,
            },
            {
                name: 'Billions',
                uri: `https://i.ytimg.com/sh/tqO05XqiGv0NAbwhzAWSyg/market_sd.jpg`,
            },
        ];
        imageBox = imageName.reverse().map((item, idx)=>{
            return (
                <TouchableOpacity style={styles.imageBox} key={idx} onPress={()=>{this.toWatchVideo(item.name)}}>
                    <Image style={styles.thumbnailImage} resizeMode='contain' source={{uri: item.uri}} defaultSource={require('../../../assets/logo/pwc_logo_2.png')}/>
                    <Text style={styles.imageBox_text}>{item.name}</Text>
                </TouchableOpacity>
            )
        });
        return imageBox;
    }

    renderImageBox3() {
        let imageBox = [];
        let imageName = [
            {
                name: 'Avatar: The Last Airbender',
                uri: `https://i.ytimg.com/sh/ZiLXAS98i5QJCAWcqfdHNg/market_sd.jpg`,
            },
            {
                name: 'Teenage Mutant Ninja Turtles',
                uri: `https://i.ytimg.com/sh/RajkBeeznzeTyYn2Ytuv5Q/market_sd.jpg`,
            },
            {
                name: 'The Wrong Mans',
                uri: `https://i.ytimg.com/sh/9IjqUquuahFrMs8-rQlFoA/market_sd.jpg`,
            },
            {
                name: 'Power',
                uri: `https://i.ytimg.com/sh/b9zOBhu7oddPGHhaFPxbYw/market_sd.jpg`,
            },
            {
                name: 'The Legend of Korra',
                uri: `https://i.ytimg.com/sh/bIkyiChuQHDuXh5681RwLQ/market_sd.jpg`,
            },
            {
                name: 'The A-Team',
                uri: `https://i.ytimg.com/sh/KmtIDwix2aqnmSEc2QEF4g/market_sd.jpg`,
            },
            {
                name: 'Prison Break',
                uri: `https://i.ytimg.com/sh/O2C9XLQ_ff9rOpBMXW1PZw/market_sd.jpg`,
            },
            {
                name: 'Naruto Shippuden Uncut',
                uri: `https://i.ytimg.com/sh/gB7FQZKIX-qZ7rDZ6zIFsw/market_sd.jpg`,
            },
        ];
        imageBox = imageName.reverse().map((item, idx)=>{
            return (
                <TouchableOpacity style={styles.imageBox} key={idx} onPress={()=>{this.toWatchVideo(item.name)}}>
                    <Image style={styles.thumbnailImage} resizeMode='contain' source={{uri: item.uri}} defaultSource={require('../../../assets/logo/pwc_logo_2.png')}/>
                    <Text style={styles.imageBox_text}>{item.name}</Text>
                </TouchableOpacity>
            )
        });
        return imageBox;
    }

    renderImageBox4() {
        let imageBox = [];
        let imageName = [
            {
                name: 'State of the Union with Jake Tapper',
                uri: `https://i.ytimg.com/sh/eyxKEi3_o5EDAt5ZnXiOxg/market_sd.jpg`,
            },
            {
                name: 'The Hour',
                uri: `https://i.ytimg.com/sh/voIHgtYHvdmnEs0fhvTJ-w/market_sd.jpg`,
            },
            {
                name: 'Soundtracks: Songs That Defined History',
                uri: `https://i.ytimg.com/sh/8LRfUn2RCAHHRg125lIUZA/market_sd.jpg`,
            },
            {
                name: 'Inside Man',
                uri: `https://i.ytimg.com/sh/tkDmmNPQfEdinktEAAcWxw/market_sd.jpg`,
            },
            {
                name: 'The Road to World War II',
                uri: `https://i.ytimg.com/sh/GYwfd_vrA9LxR6vyctLvjA/market_sd.jpg`,
            },
            {
                name: 'VICE',
                uri: `https://i.ytimg.com/sh/TRvrnv00X_ekAbQgU2Iv_g/market_sd.jpg`,
            },
            {
                name: 'Great Decisions in Foreign Policy',
                uri: `https://i.ytimg.com/sh/h6uQmfYIjm0yxJT7gyFkVA/market_sd.jpg`,
            },
            {
                name: '9/11 Commemorative Collection',
                uri: `https://i.ytimg.com/sh/PRm-qvLQu2fKeVipHGXssw/market_sd.jpg`,
            },
        ];
        imageBox = imageName.reverse().map((item, idx)=>{
            return (
                <TouchableOpacity style={styles.imageBox} key={idx} onPress={()=>{this.toWatchVideo(item.name)}}>
                    <Image style={styles.thumbnailImage} resizeMode='contain' source={{uri: item.uri}} defaultSource={require('../../../assets/logo/pwc_logo_2.png')}/>
                    <Text style={styles.imageBox_text}>{item.name}</Text>
                </TouchableOpacity>
            )
        });
        return imageBox;
    }

    renderVideoCategories() {
        return (
            <View style={styles.pageView}>

                <View style={styles.titleBar}>
                    <Text style={styles.RecordedBoxTitle}>Recorded</Text>
                </View>

                <View style={styles.ViewBody}>
                    <ScrollView style={styles.scrollView_BOx}>
                        <View style={styles.category}>
                            <View style={styles.categoryTitleBar}>
                                <Text style={styles.categoryTitle}>All</Text>
                                <Text style={styles.categoryTitleViewAll}>VIEW ALL</Text>
                            </View>
                            <View style={styles.categoryScrollView}>
                                <ScrollView horizontal={true}>
                                    {this.renderImageBox1()}
                                </ScrollView>
                            </View>
                        </View>

                        <View style={styles.category}>
                            <View style={styles.categoryTitleBar}>
                                <Text style={styles.categoryTitle}>Drama</Text>
                                <Text style={styles.categoryTitleViewAll}>VIEW ALL</Text>
                            </View>
                            <View style={styles.categoryScrollView}>
                                <ScrollView horizontal={true}>
                                    {this.renderImageBox2()}
                                </ScrollView>
                            </View>
                        </View>

                        <View style={styles.category}>
                            <View style={styles.categoryTitleBar}>
                                <Text style={styles.categoryTitle}>Action & Adventure</Text>
                                <Text style={styles.categoryTitleViewAll}>VIEW ALL</Text>
                            </View>
                            <View style={styles.categoryScrollView}>
                                <ScrollView horizontal={true}>
                                    {this.renderImageBox3()}
                                </ScrollView>
                            </View>
                        </View>

                        <View style={styles.category}>
                            <View style={styles.categoryTitleBar}>
                                <Text style={styles.categoryTitle}>News</Text>
                                <Text style={styles.categoryTitleViewAll}>VIEW ALL</Text>
                            </View>
                            <View style={styles.categoryScrollView}>
                                <ScrollView horizontal={true}>
                                    {this.renderImageBox4()}
                                </ScrollView>
                            </View>
                        </View>
                    </ScrollView>

                </View>

            </View>
        )
    }

    render(){
        return(
            <View style={styles.viewBox}>

                {this.props.hamburgerActions.Recorded_CategoryToVideo &&
                this.renderVideoCategories()
                }

                {!this.props.hamburgerActions.Recorded_CategoryToVideo &&
                    <RecordedPlaying socket = {this.props.socket} />
                }

            </View>
        )
    }


    toWatchVideo(videoName) {
        if(videoName === 'Friends-701' || videoName === 'ChefsTable-104'){
            this.props.switchRecordedCategoryVideo(videoName, false);
            this.props.navigateTo('','','Info','home')
            AsyncStorage.setItem('WATCHING_NOW', JSON.stringify({
                type: 'OTT',
                content: videoName
            }));

        }
        if(videoName === 'Big Buck Bunny' || videoName === 'Sintel') {
            this.props.switchRecordedCategoryVideo(videoName.replace(/\s/g,'').toLowerCase(), false);
            this.props.navigateTo('','','Info','home')
            AsyncStorage.setItem('WATCHING_NOW', JSON.stringify({
                type: 'OTT',
                content: videoName
            }));
        }
        globalEventEmitter.emit('contentSwitch', true);

    }



}


const styles = StyleSheet.create({
    viewBox:{
        flex:1,
        // borderTopWidth: 1,
        // borderTopColor: '#00B388',
    },
    pageView: {
        flex: 1,
        backgroundColor: '#202020',
    },
    pageNotice: {
        fontSize: 50,
    },
    titleBar: {
        flex: 1,
        justifyContent:'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#101010',
    },
    ViewBody: {
        flex: 10,
    },
    scrollView_BOx:{
        paddingTop: 15,
        paddingBottom: 25,
    },
    RecordedBoxTitle: {
        color: '#FFFFFF',
        fontSize: 40,
    },
    category: {
        flex:1,
        marginLeft: 20,
        marginRight: 20,
    },
    categoryTitleBar:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 28,
    },
    categoryTitle:{
        flex: 1,
        color: '#FFFFFF',
        fontSize: 24,
        textAlign: 'left',
    },
    categoryTitleViewAll:{
        flex: 1,
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'right',
        opacity: 0.8,
    },
    categoryScrollView:{
        flex: 4,
    },
    imageBox: {
        flex: 1,
        width: 200,
        height: 180,
        marginRight: 10,
    },
    thumbnailImage:{
        flex:5,
        width: '100%',
    },
    imageBox_text:{
        flex: 2,
        color: '#FFFFFF',
        fontSize: 14,
        paddingTop: 2,
        paddingBottom: 2,
        height: 28,
    },
});


//---------------    container    -----------------
const mapStateToProps = state => ({
    init: state.init,
    app: state.app,
    hamburgerActions: state.hamburgerActions,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        switchLiveCategoryVideo, switchRecordedCategoryVideo, setLeftTopVideoMode,
        navigateTo,
        switchComponent, currentHamburgerMarkAt,
        videoReceivedFromFriendShared
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(Recorded);