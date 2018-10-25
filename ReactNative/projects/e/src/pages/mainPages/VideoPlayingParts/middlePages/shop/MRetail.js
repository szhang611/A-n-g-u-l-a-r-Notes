import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, Button, Image, TextInput, WebView, TouchableOpacity, AsyncStorage } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons'
import Swiper from 'react-native-swiper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import urls from '../../../../../services/APIUrl';
import { APIService } from '../../../../../services/APIService';
import { navigateTo } from '../../../../../actions/NavigationAction';
import { globalEventEmitter } from '../../../../../utils/globalEventEmitter';


class MRetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: this.images,
            showWebView: false,
            productsUrl: '',
            posterUri: 'pic',
            title: '',
            handing: 0,
            shipping: 1,
            price: '$0',
            desp: '',
            gallery: [],
            hasStarFavorited: false,
            favoriteProductsList: [],
            userId: '',
        }
    }
    contentID = '';

    componentWillMount() {
        AsyncStorage.getItem('USER_ID').then((res)=>{
            this.setState({userId : res}, ()=>{
                this.getFavouriteList();
            });
        });

        let index;
        let products;
        if(this.props.init.products || this.props.init.allProducts) {
            if(this.props.init.productId > 0) {
                index = this.props.init.productId - 1;
                products = this.props.init.products[index];
            } else if(this.props.init.productId_SelectedContent > 0) {
                index = this.props.init.productId_SelectedContent - 1;
                products = this.props.init.allProducts[index];
            }
            if(products) {
                AsyncStorage.getItem('NowPlayingLeftBottom').then((res)=>{
                    console.log('NowPlayingLeftBottom : ' + res);
                    if(res === 'Yes') {
                        if(this.props.leftBottomVideoName) {  // OTT only (temp)
                            this.contentID = this.props.leftBottomVideoName;
                        }else {
                            this.contentID = this.props.init.contentid;
                        }
                    } else {
                        this.contentID = this.props.init.contentid;
                    }

                    this.setState({
                        posterUri: urls.CDN_old + this.contentID + '/static/' + products.poster,
                        title: products.title,
                        handing: products.info ? (products.info.handling.time).substring(0, 1) : 0,
                        shipping: products.info ? (products.info.shipping.time).substring(0, 1) : 0,
                        price: products.prices ? products.prices.price : 0,
                        desp: products.description,
                        productsUrl: products.actions ? products.actions[0].url : ''
                        //gallery: this.renderGallery(products.gallery, index)
                    },()=>{
                        let idx = _.findIndex(this.state.favoriteProductsList, {title: products.title});
                        this.setState({hasStarFavorited: (idx > -1)});
                    })

                });

            }
        }


        globalEventEmitter.addListener('startLeftTopPlaying', ()=>{
            this.contentID = this.props.init.contentid;
        });
        globalEventEmitter.addListener('startLeftBottomPlaying', ()=>{
            if(this.props.leftBottomVideoName) {  // OTT only (temp)
                this.contentID = this.props.leftBottomVideoName;
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        let index;
        let products;
        if(nextProps.init.products || nextProps.init.allProducts) {
            if(nextProps.init.productId > 0) {
                index = nextProps.init.productId - 1;
                products = nextProps.init.products[index];
            }
            if(products) {
                this.setState({
                    posterUri: urls.CDN_old + this.contentID + '/static/' + products.poster,
                    title: products.title,
                    handing: products.info ? (products.info.handling.time).substring(0, 1) : 0,
                    shipping: products.info ? (products.info.shipping.time).substring(0, 1) : 0,
                    price: products.prices ? products.prices.price : 0,
                    desp: products.description,
                    productsUrl: products.actions ? products.actions[0].url : ''
                    //gallery: this.renderGallery(products.gallery, index)
                },()=>{
                    let idx = _.findIndex(this.state.favoriteProductsList, {title: products.title});
                    this.setState({hasStarFavorited: (idx > -1)});
                })
            }
        }
    }

    componentWillUnmount() {
        this.setState({favoriteProductsList: []});
    }

    openWebView = () => {
        this.setState({ showWebView: false })
    }

    renderGallery = (gallery, index) => {
        let image1 = [
            <Image resizeMode='stretch' style={{ width: '60%', height: '60%' }} source={{ uri: 'http://114.31.83.55/metadata/Friends-701/static/Product/1/71EPbJS4pKL._SL1024_.jpg' }} />,
            <Image resizeMode='stretch' style={{ width: '60%', height: '60%' }} source={{ uri: 'http://114.31.83.55/metadata/Friends-701/static/Product/1/61UTPByqidL._SL1024_.jpg' }} />
        ]
        let image2 = [
            <Image resizeMode='stretch' style={{ width: '100%', height: '100%' }} source={{ uri: 'http://114.31.83.55/metadata/Friends-701/static/Product/3/il_570xN.1132749827_53wk.jpg' }} />,
            <Image resizeMode='stretch' style={{ width: '100%', height: '100%' }} source={{ uri: 'http://114.31.83.55/metadata/Friends-701/static/Product/3/il_570xN.1198838219_fuwb.jpg' }} />
        ]
        // if (gallery) {
        //     let images = gallery.map((item, i) => {
        //         let imgUrl = urls.CDN_old + this.props.init.contentid + '/static/' + item.file;
        //         return (
        //             //<View style={styles.slide} key={i}>
        //             <Image resizeMode='stretch' style={{ width: 200, height: 200 }} source={{ uri: imgUrl }} />
        //             // </View>
        //         )
        //     })
        //     return images;
        // }
        if (index % 2 == 0) {
            return image1;
        } else {
            return image2;
        }
    }

    navigateBack () {
        if(this.props.nav.from_subTab === 'allProducts') {
            this.props.navigateTo('Shop','productDetails','Shop','allProducts')
        } else {
            this.props.navigateTo('Shop','productDetails','Shop','home')
        }
    }

    async getFavouriteList()  {
        let res = await APIService.getFavouriteList(this.state.userId);
        console.log(res);
        this.setState({favoriteProductsList: res.socialResponse}, ()=>{
            if(this.state.title) {
                let idx = _.findIndex(this.state.favoriteProductsList, {title: this.state.title});
                this.setState({hasStarFavorited: (idx > -1)});
            }
        });
    };

    starThisProduct() {
        this.setState({hasStarFavorited: !this.state.hasStarFavorited}, ()=>{
            if(this.state.hasStarFavorited) {
                this.insertStarProduct();
            } else {
                this.removeStarProduct();
            }
        });
    }

    async insertStarProduct() {
        let sceneid = this.props.init.productId_SelectedContent_sceneId ? this.props.init.productId_SelectedContent_sceneId : this.props.init.scene.sceneid;
        let product_item = {
            title: this.state.title,
            contentid: this.props.init.contentid,
            productDetails: {
                posterUri: this.state.posterUri,
                handing: this.state.handing,
                shipping: this.state.shipping,
                price: this.state.price,
                desp: this.state.desp,
                productsUrl: this.state.productsUrl,
            },
            scene: {
                sceneid: sceneid,
                content: this.props.init.scenes.scenes[sceneid-1]
            }
        };

        let temList = this.state.favoriteProductsList;
        temList.push(product_item);
        this.setState({favoriteProductsList: temList})
        let res = await APIService.addFav(this.state.userId, product_item);
        console.log(res);
    }

    async removeStarProduct() {
        let idx = _.findIndex(this.state.favoriteProductsList, {title: this.state.title});
        if(idx > -1) {
            this.state.favoriteProductsList.splice(idx, 1);
            let res = await APIService.cancelFav(this.state.userId, this.state.title);
            console.log(res);
        }
    }

    renderComponent = (showWebView) => {
        if (showWebView) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ backgroundColor: '#f4f4f4', height: 40, justifyContent: 'center' }}>
                        <TouchableOpacity onPress={this.openWebView}><Image source={require('../../../../../assets/logo/return.png')} style={{ width: 30, height: 30, marginLeft: 10 }} resizeMode='stretch' /></TouchableOpacity>
                    </View>
                    <WebView
                        source={{ uri: this.state.productsUrl }}
                        style={{ marginTop: 5 }}
                    />
                </View>
            )
        } else {
            return (
                <View style={{flex: 1,}}>
                    <View style = {styles.shopNavBar}>
                        <TouchableOpacity style={styles.backIcon} onPress={()=>{this.navigateBack()}}>
                            <Icons
                                style={{padding: 3}}
                                name={'navigate-before'}
                                color={'#FFFFFF'}
                                size={36}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.homeIcon} onPress={()=>{this.props.navigateTo('Shop','productDetails','Shop','home')}} >
                            <Icons
                                style={{padding: 3}}
                                name={'home'}
                                color={'#FFFFFF'}
                                size={36}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.retailContainer}>
                        <View style={styles.posterContainer}>
                            <View style={styles.poster}>
                                <Image source={{ uri: this.state.posterUri }} resizeMode='stretch' style={styles.bigImage} />
                            </View>
                            {/* <View style={styles.gallery}>
                            <View style={styles.container}>
                                <Swiper style={styles.wrapper} autoplay={true} index={0}>
                                    {this.state.gallery}
                                </Swiper>
                            </View>
                        </View> */}
                        </View>
                        <View style={styles.infoContainer}>
                            <View style={styles.panel}>
                                <View style={styles.productsInfo}>
                                    <View style={styles.titleContainer}>
                                        <Text style={styles.title}>{this.state.title}</Text>
                                    </View>
                                    <View style={styles.subInfoContainer}>
                                        <Text style={styles.info}>Email to a Friend</Text>
                                        <Text style={styles.info}>Be the first to review this product</Text>
                                        <Text style={styles.info}>Tailoring & Handling Time: {this.state.handing} business day(s)</Text>
                                        <Text style={styles.info}>Shipping Time: Expedited {this.state.shipping} business day(s)</Text>
                                    </View>
                                    <View style={styles.priceContainer}>
                                        {/* <Text style={{ fontSize: 18, color: 'grey', textDecorationLine: 'line-through', marginRight: 20 }}>$399.99</Text> */}
                                        <Text style={{ fontSize: 20, color: 'red', marginLeft: 5 }}>{this.state.price}</Text>
                                    </View>
                                    <View style={styles.despContainer}>
                                        <Text style={{ fontWeight: 'bold' }}>QUICK OVERVIEW</Text>
                                        <Text style={[{ fontSize: 14, color: 'grey' }]}>
                                            {((this.state.desp).length > 200) ?
                                                (((this.state.desp).substring(0, 200 - 3)) + '...') :
                                                this.state.desp}
                                        </Text>
                                    </View>
                                    <View style={styles.buyButton}>
                                        <TouchableOpacity style={styles.goToBuyIt} onPress={() => { this.setState({ showWebView: true }) }}>
                                            <Text style={{ color: '#fff' }}>GO TO BUY IT !</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.favoritesStars} onPress={_.debounce(()=>{this.starThisProduct()}, 100)}>
                                            {
                                                this.state.hasStarFavorited &&
                                                <Icons name={'star'} color={'#ffae00'} size={28} />
                                            }
                                            {
                                                !this.state.hasStarFavorited &&
                                                <Icons name={'star-border'} color={'#000'} size={28} />
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            {/* <View style={styles.services}>
                            <Image source={require('../../assets/images/amazon.png')} resizeMode='stretch' style={styles.serviceImg} />
                            <Image source={require('../../assets/images/ebay.png')} resizeMode='stretch' style={styles.serviceImg} />
                        </View> */}
                        </View>
                    </View>
                </View>
            )
        }
    }

    render() {
        return (
            this.renderComponent(this.state.showWebView)
        )
    }
}

const styles = StyleSheet.create({
    retailContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    shopNavBar: {
        // flex: 1,
        flexDirection : 'row',
        padding: 10,
        backgroundColor: '#000',
    },
    backIcon: {
        flexDirection : 'row',
        flex: 1,
        justifyContent: 'flex-start',
    },
    homeIcon: {
        flexDirection : 'row',
        flex: 1,
        justifyContent: 'flex-end',
    },
    posterContainer: {
        height: '80%',
        width: '42%',
        backgroundColor: '#fff',
        flexDirection: 'column'
    },
    poster: {
        height: 350,
        borderRightColor: '#f4f4f4',
        borderRightWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bigImage: {
        width: '98%',
        height: 300,
    },
    gallery: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: '#f4f4f4',
        borderRightWidth: 1
    },
    smallImage: {
        marginLeft: '1%',
        height: '50%',
        width: '30%'
    },
    infoContainer: {
        height: '80%',
        width: '54%',
        backgroundColor: '#fff'
    },
    panel: {
        flex: 1,
        alignItems: 'center'
    },
    productsInfo: {
        flex: 5,
        flexDirection: 'column',
        width: '99%'
    },
    titleContainer: {
        height: '10%',
        marginBottom: '4%',
        marginTop: 15,
        marginLeft: 5
    },
    subInfoContainer: {
        height: 80,
        backgroundColor: '#fff',
        marginTop: 15
    },
    priceContainer: {
        height: '6%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 15
    },
    despContainer: {
        height: 70,
        backgroundColor: '#fff',
        marginLeft: 5,
        marginTop: 20
    },
    buyButton: {
        height: 100,
        flexDirection: 'row',
        width: '100%',
        marginTop: 50,
    },
    goToBuyIt: {
        flex: 1,
        backgroundColor: 'green',
        width: '90%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    favoritesStars: {
        flex: 1,
        height: 30,
        paddingLeft: 30,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    optionsContainer: {
        flex: 1,
        // backgroundColor: '#f4f4f4'
    },
    flagContainer: {
        height: '5%',
        marginLeft: 5
    },
    numberContainer: {
        height: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: 10,
        marginBottom: 10,
        alignItems: 'center'
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        marginTop: '4%'
    },
    info: {
        fontSize: 12,
        color: 'grey',
        height: 16,
        marginBottom: 1,
        marginLeft: 5
    },
    actions: {
        height: 100,
        width: '90%',
        backgroundColor: 'grey'
    },
    cart: {
        flex: 1,
        // backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    wishList: {
        flex: 1,
        backgroundColor: '#fff',
        borderBottomColor: '#f4f4f4',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    compare: {
        flex: 1,
        borderBottomColor: '#f4f4f4',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    services: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    serviceImg: {
        width: '10%',
        height: '60%'
    },
    container: {
        flex: 1
    },
    wrapper: {
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    }
});



//---------------    container    -----------------
const mapStateToProps = state => ({
    init: state.init,
    nav: state.nav,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        navigateTo
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(MRetail);