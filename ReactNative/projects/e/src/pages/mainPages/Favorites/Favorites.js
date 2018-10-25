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

import { switchLiveCategoryVideo, switchRecordedCategoryVideo, setLeftTopVideoMode } from '../../../actions/CategoryAndVideoSwitchActions';
import { switchComponent, currentHamburgerMarkAt } from '../../../actions/MainPageActions';
import { navigateTo } from '../../../actions/NavigationAction';
import { videoReceivedFromFriendShared } from '../../../actions/InitActions';


class Favorites extends Component {
    constructor() {
        super();

        this.state = {
            productsList: [],
            displayProducts: false,
            userId: '',
            buyProductUrl: '',
            displayWebView: false,
        };
    }

    componentWillMount() {
        AsyncStorage.getItem('USER_ID').then((res)=>{
            this.setState({userId : res},()=>{
                this.getFavouriteList();
            });
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

    async getFavouriteList()  {
        let res = await APIService.getFavouriteList(this.state.userId);
        console.log(res);
        if(res.status === 'success' && res.socialResponse && res.socialResponse.length > 0) {
            this.setState({
                productsList: res.socialResponse,
                displayProducts: true
            });
        }
    };

    buyThisProduct(item) {
        this.setState({
            buyProductUrl: item.productDetails.productsUrl,
            displayWebView: true
        });
    }
    closeWebview() {
        this.setState({
            buyProductUrl: '',
            displayWebView: false
        });
    }

    playVideo(item) {
        // console.log(item);
        this.props.switchComponent('Recorded');
        this.props.switchRecordedCategoryVideo(item.contentid, false, item.scene.content.start/1000);
        this.props.navigateTo('', '', 'Info', 'home');
        this.props.setLeftTopVideoMode('Recorded');
        this.props.currentHamburgerMarkAt('Recorded', false);
    }

    deleteFavAlert(item) {
        Alert.alert(
            `Delete \' ${item.title.trim()} \' from your favorites?`,
            '',
            [
                { text: 'Cancel', onPress: () => { console.log('cancel delete product!') }},
                { text: 'Yes', onPress: () => { this.deleteFavItem(item) } }
            ],
            { cancelable: false }
        )
    }

    async deleteFavItem(item) {
        console.log('delete product!');
        let idx = _.findIndex(this.state.productsList, {title: item.title});
        if(idx > -1) {
            let res = await APIService.cancelFav(this.state.userId, item.title);
            let tep = this.state.productsList;
            tep.splice(idx, 1);
            this.setState({productsList: tep});
        }
    }

    renderProducts() {
        return this.state.productsList.map((item, idx)=>{
            // console.log(item);
            return (
                <View style={styles.productsWrapperr} key={idx}>
                    <View style={styles.productLeftPart}>
                        <Image style={styles.productLeftImage}
                               resizeMode='cover'
                               source={{ uri: item.productDetails.posterUri }}
                               defaultSource={require( '../../../assets/logo/pwc_logo_2.png')}
                        />
                    </View>

                    <View style={styles.productMiddlePart}>
                        <Text style={styles.productMiddleTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.productMiddleDescription} numberOfLines={3}>{item.productDetails.desp}</Text>
                        <View style={styles.productMiddleBuyItButton}>
                            <Text style={styles.pricee}>{item.productDetails.price}</Text>
                            <TouchableOpacity style={styles.butItBtn} onPress={()=>{this.buyThisProduct(item)}}>
                                <Text style={styles.butItBtnText}>GO TO BUY IT !</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.productRemoveFavIcon}>
                            <TouchableOpacity style={styles.removeIcon} onPress={()=>{this.deleteFavAlert(item)}}>
                                <Icons name={'delete'} color={'#DDD'} size={30}/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.productRightPart} onPress={()=>{this.playVideo(item)}}>
                        <Image style={styles.productRightImage}
                               resizeMode='cover'
                               source={{ uri: `${urls.CDN_old}/${item.contentid}/${item.scene.content.sceneId}/static/${item.scene.content.image}`}}
                               defaultSource={require( '../../../assets/logo/pwc_logo_2.png')}
                        />
                        <View style={styles.productRightPartIcon}>
                            <Icons style={styles.productRightIcon} name={'play-circle-outline'} size={60} color={'#FFF'}/>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        });
    }

    render() {
        return(
            <View style={styles.favoritesView}>
                <View style={styles.titleBar}>
                    <Text style={styles.favoritesBoxTitle}>Your Favorites</Text>
                </View>
                <View style={styles.favoritesViewBody}>
                    {
                        this.state.displayProducts &&
                        <ScrollView>
                            {
                                this.renderProducts()
                            }
                        </ScrollView>
                    }
                    {
                        !this.state.displayProducts &&
                        <View>
                            <Text style={styles.noticeText}>Watch videos and find your favorites.</Text>
                        </View>
                    }
                </View>

                {
                    this.state.displayWebView &&
                    <View style={styles.productWebView}>
                        <View style={{ backgroundColor: '#f4f4f4', height: 40, justifyContent: 'center' }}>
                            <TouchableOpacity onPress={()=>{this.closeWebview()}}><Image source={require('../../../assets/logo/return.png')} style={{ width: 30, height: 30, marginLeft: 10 }} resizeMode='stretch' /></TouchableOpacity>
                        </View>
                        <WebView source={{ uri: this.state.buyProductUrl }}/>
                    </View>
                }

            </View>
        )
    }

}



const styles = StyleSheet.create({
    favoritesView: {
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
    favoritesBoxTitle: {
        color: '#FFFFFF',
        fontSize: 40,
    },
    favoritesViewBody: {
        flex: 10,
        zIndex: 2,
    },
    noticeText: {
        color: '#FFF',
        fontSize: 16,
        padding: 15,
    },
    productsWrapperr: {
        height: 150,
        width: '100%',
        flexDirection: 'row',
    },
    productLeftPart: {
        flex: 17,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productLeftImage: {
        width: '100%',
        maxWidth: 130,
        height: 130,
    },
    productMiddlePart: {
        height: 150,
        flex: 66,
        position: 'relative',
    },
    productMiddleTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
        height: 24,
        lineHeight: 24,
        marginTop: 10,
    },
    productMiddleDescription: {
        fontSize: 12,
        color: '#FFF',
        lineHeight: 18,
    },
    productMiddleBuyItButton: {
        position: 'absolute',
        bottom: 5,
        width: '45%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    pricee: {
        flex: 4,
        fontSize: 18,
        color: '#FFF',
    },
    butItBtn: {
        flex: 6,
    },
    butItBtnText: {
        height: 30,
        textAlign: 'center',
        lineHeight: 30,
        color: '#FFF',
        backgroundColor: 'green',
    },
    productRemoveFavIcon: {
        position: 'absolute',
        right: 20,
        bottom: 10,
    },
    removeIcon: {

    },
    productRightPart: {
        flex: 17,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    productRightImage: {
        width: '100%',
        maxWidth: 130,
        height: 130,
    },
    productRightPartIcon: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productRightIcon: {
        backgroundColor: 'transparent',
    },
    productWebView: {
        zIndex: 3,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    }
});



//---------- container ----------

const mapStateToProps = state => ({
    init: state.init,
    nav: state.nav,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        switchLiveCategoryVideo, switchRecordedCategoryVideo, setLeftTopVideoMode,
        switchComponent, currentHamburgerMarkAt, navigateTo, videoReceivedFromFriendShared,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(Favorites);