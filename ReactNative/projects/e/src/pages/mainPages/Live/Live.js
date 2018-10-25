import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, AlertIOS, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import nbcLogo from '../../../assets/logo/NBC_logo.svg.png'
import LivePlaying from './LivePlaying';
import { switchLiveCategoryVideo, fetchLiveVideo } from '../../../actions/CategoryAndVideoSwitchActions';
import { AsyncStorage } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons'

import golf from '../../../assets/images/live/golf.jpg'
import ICF from '../../../assets/images/live/ICF.jpg'
import liverpool from '../../../assets/images/live/Liverpool.jpeg'
import sports from '../../../assets/images/live/NBCSports.jpg'

import bbc from '../../../assets/images/live/BBC.jpeg'
import cnn from '../../../assets/images/live/CNN.jpeg'
import cgtn from '../../../assets/images/live/CGTN.jpg'
import nbcNews from '../../../assets/images/live/nbcNight.jpg'
import skynews from '../../../assets/images/live/sjynews.jpeg'

import AllUrls from '../../../services/APIUrl';
import {navigateTo} from '../../../actions/NavigationAction'
import { emitMoveOnAvatar, videoReceivedFromFriendShared } from '../../../actions/InitActions';
import { switchRecordedCategoryVideo, setLeftTopVideoMode } from '../../../actions/CategoryAndVideoSwitchActions';
import { switchComponent, currentHamburgerMarkAt } from '../../../actions/MainPageActions';


class Live extends Component {
    constructor() {
        super();
    }

    state = {
        liveNow : false, 
        liveContent: '',
        pushId: -1
    };


    componentWillMount() {
        this.props.fetchLiveVideo(this.props.app);
    }

    componentWillReceiveProps(nextProps) {
        let hamburgerActions = nextProps.hamburgerActions;
        let liveNow = hamburgerActions.liveNow
        let liveContent = hamburgerActions.liveContent
        this.state.liveNow = liveNow
        this.state.liveContent = liveContent


        if(nextProps.init.videoContent_ReceivedFromFriendShared && nextProps.init.videoContent_ReceivedFromFriendShared.vId> this.state.pushId &&
            nextProps.init.videoContent_ReceivedFromFriendShared.video.type === 'Live') {
            if(this.props.hamburgerActions.Live_CategoryToVideo) {
                this.props.switchComponent('Live');
                this.props.switchLiveCategoryVideo(nextProps.init.videoContent_ReceivedFromFriendShared.contentid, false, nextProps.init.videoContent_ReceivedFromFriendShared.video.offset);
                this.props.navigateTo('', '', 'Info', 'home');
                this.props.setLeftTopVideoMode('Live');
                this.props.currentHamburgerMarkAt('Live', false);
                let sharer = nextProps.init.videoContent_ReceivedFromFriendShared.sharer;
                AsyncStorage.setItem('tempStoreSharer_beforeNavigateToLivePlaying', JSON.stringify(sharer));
                nextProps.init.videoContent_ReceivedFromFriendShared = {};
            }
        }

        if(nextProps.init.videoContent_ReceivedFromFriendShared && nextProps.init.videoContent_ReceivedFromFriendShared.vId> this.state.pushId
            && nextProps.init.videoContent_ReceivedFromFriendShared.video.type === 'OTT') {
            this.props.switchComponent('Recorded');
            this.props.navigateTo('', '', 'Info', 'home');
            this.props.setLeftTopVideoMode('Recorded');
            this.props.currentHamburgerMarkAt('Recorded', false);
            this.props.switchRecordedCategoryVideo(nextProps.init.videoContent_ReceivedFromFriendShared.contentid, false, Number(nextProps.init.videoContent_ReceivedFromFriendShared.video.offset));
            nextProps.init.videoContent_ReceivedFromFriendShared = {};
        }
    }

    componentDidMount() {

    }

    refreshLiveNow() {
        this.props.fetchLiveVideo(this.props.app);
    }

    renderImageBox1() {
        let imageBox = [];
        let imageName = [
            {
                name: this.state.liveContent ,
                uri: AllUrls.videoThumbnailImage(this.state.liveContent, 1, 'thumbnail.jpg'),
            }
        ];

            imageBox = imageName.map((item, idx)=>{
                return (
                    <TouchableOpacity style={styles.imageBox} key={idx} onPress={()=>{this.toWatchVideo(item.name)}}>
                        <Image style={styles.thumbnailImage} resizeMode='contain' source={{uri: item.uri}} defaultSource={require('../../../assets/logo/pwc_logo_2.png')}/>
                        
                        <View style = {{ flexDirection: 'row' }}> 
                            <Text style={styles.imageBox_text}>{item.name}</Text> 
                            <View  >
                                <Text style = {{ color : 'green'}}>
                                    Live Now
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            });
            return imageBox;
      
    }

    renderNoVideoLive(){
        return (
            <View style = {{ flex : 1}} >
                <Text style = {{ fontSize : 20 , color : '#FFFFFF' }}> No Video Live on the primary screen!</Text>    
            </View>
        )
    }

    renderImageBox2() {
        let imageBox = [];
        let imageName = [
            {
                name: 'NBC News',
                img: nbcNews
            },
            {
                name: 'Sky News ',
                img: skynews
            },
           
            {
                name: 'CNN News',
                img: cnn
            },
            {
                name: 'BBC News',
                img: bbc
            },
            {
                name: 'CGTN News',
                img: cgtn
            }
        ];
        imageBox = imageName.map((item, idx)=>{
            return (
                <TouchableOpacity style={styles.imageBox} key={idx} onPress={()=>{this.toWatchVideo(item.name)}}>
                    <Image style={styles.thumbnailImage} resizeMode='contain' source={item.img} defaultSource={require('../../../assets/logo/pwc_logo_2.png')}/>
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
                name: 'Golf Channel Boeing Classic - Rd 2',
                img: golf,
            },
            {
                name: 'NBC Sports Gold Premier League Preview',
                img: sports,
            },
            {
                name: 'Olympic Channel ICF Canoe Sprint World Championships - Day 1',
                img: ICF,
            },
            {
                name: 'NBC Liverpool v. Brighton',
                img: liverpool,
            }
        ];
        imageBox = imageName.map((item, idx)=>{
            return (
                <TouchableOpacity style={styles.imageBox} key={idx} onPress={()=>{this.toWatchVideo(item.name)}}>
                    <Image style={styles.thumbnailImage} resizeMode='contain' source={item.img} defaultSource={require('../../../assets/logo/pwc_logo_2.png')}/>
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
                    <Text style={styles.LiveBoxTitle}>Live</Text>
                </View>

                    <View style={styles.ViewBody}>
                        <ScrollView style={styles.scrollView_BOx}>
                        <View style={styles.category}>
                            <View style={styles.categoryTitleBar}>
                                <Text style={styles.categoryTitle}>Live Now</Text>
                                <TouchableOpacity style={styles.refreshIcon} onPress={()=>{this.refreshLiveNow()}}>
                                    <Icons style={{paddingRight: 5}} name={'refresh'} color={'#FFFFFF'} size={16}/>
                                    <Text style={styles.categoryTitle_refresh}>Refresh Live</Text>
                                </TouchableOpacity>
                                <Text style={styles.categoryTitleViewAll}>VIEW ALL</Text>
                            </View>
                            <View style={ this.state.liveNow ? { flex: 4 , flexDirection: 'row'} : { flex: 4 , marginTop : 25, marginBottom:25} } >
                                <Image  style={ this.state.liveNow ?  { top: 50, height : 50, width: 50 }:  {  height : 50, width: 50, flex: 1} } resizeMode='contain' source={nbcLogo}></Image>
                                 { ( this.state.liveNow && <ScrollView style={{ left: 20}}  horizontal={true}>
                                    {   this.renderImageBox1()}
                                </ScrollView> ) }
                                {!this.state.liveNow && this.renderNoVideoLive()}
                            </View>
                        </View>

                        <View style={styles.category}>
                            <View style={styles.categoryTitleBar}>
                                <Text style={styles.categoryTitle}>News</Text>
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
                                <Text style={styles.categoryTitle}>Sports</Text>
                                <Text style={styles.categoryTitleViewAll}>VIEW ALL</Text>
                            </View>
                            <View style={styles.categoryScrollView}>
                                <ScrollView horizontal={true}>
                                    {this.renderImageBox3()}
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

                {this.props.hamburgerActions.Live_CategoryToVideo &&
                    this.renderVideoCategories()
                }

                {!this.props.hamburgerActions.Live_CategoryToVideo &&
                    <LivePlaying socket = {this.props.socket}/>
                }

            </View>
        )
    }

    toWatchVideo(videoName) {
        if(videoName === 'Friends-701' || videoName === 'ChefsTable-104'){
            this.props.switchLiveCategoryVideo(videoName, false);
            this.props.navigateTo('','','Info','home')
            AsyncStorage.setItem('WATCHING_NOW', JSON.stringify({
                type: 'LIVE',
                content: videoName
            }));
        }
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
    LiveBoxTitle: {
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
    refreshIcon: {
        flex: 4,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    categoryTitle_refresh: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'left',
        height: 14,
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
        switchLiveCategoryVideo, fetchLiveVideo,
        emitMoveOnAvatar, videoReceivedFromFriendShared, switchRecordedCategoryVideo,
        switchComponent, currentHamburgerMarkAt, setLeftTopVideoMode, navigateTo
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(Live);