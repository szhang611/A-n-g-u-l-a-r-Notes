import React, { Component } from 'react';
import { StyleSheet, Text, View, AlertIOS, Button, Image, TouchableOpacity, ScrollView, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import urls from '../../../../services/APIUrl';

import { chooseProduct } from "../../../../actions/ProductActions";
import { navigateTo } from '../../../../actions/NavigationAction';
import { getAllProducts, getAllProductsMapping } from '../../../../actions/SceneActions';
import { globalEventEmitter } from '../../../../utils/globalEventEmitter';

class MShopTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
        }
    }

    componentWillMount() {
        if (this.props.init.products) {
            this.setState({
                products: this.props.init.products,
                content: this.props.init.contentid
            });
        }
        AsyncStorage.getItem('NowPlayingLeftBottom').then((res)=>{
            console.log('NowPlayingLeftBottom : ' + res);
            if(res === 'Yes') {
                if(this.props.leftBottomVideoName) {  // OTT only (temp)
                    this.setState({content: this.props.leftBottomVideoName});
                }
            }
        });
        globalEventEmitter.addListener('startLeftTopPlaying', ()=>{
            this.setState({content: this.props.init.contentid});
        });
        globalEventEmitter.addListener('startLeftBottomPlaying', ()=>{
            if(this.props.leftBottomVideoName) {  // OTT only (temp)
                this.setState({content: this.props.leftBottomVideoName});
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.content === '' || this.state.content === undefined) {
            this.setState({content: nextProps.init.contentid});
        }
        if (nextProps.init.products) {
            this.setState({products: nextProps.init.products,});
        }
    }

    chooseProduct(idx) {
        this.props.chooseProduct(this.props.init, idx);
        this.props.navigateTo('Shop','Home','Shop','productDetails');
    }

    navigateToSelectedContent() {
        this.props.navigateTo('Shop','home','Shop','allProducts','SelectedContent');
        // let contentid = '';
        // if(this.props.hamburgerActions.hamburgerMenuSelect === 'Recorded') {
        //     contentid = this.props.hamburgerActions.Recorded_CurrentVideoName;
        // } else if(this.props.hamburgerActions.hamburgerMenuSelect === 'Live') {
        //     contentid = this.props.hamburgerActions.Live_CurrentVideoName;
        // }
        this.props.getAllProducts(this.props.app, this.props.init, this.state.content);
        this.props.getAllProductsMapping(this.props.app, this.props.init, this.state.content);
    }

    renderSelectedContent () {
        let HOST = urls.CDN_old + this.state.content + '/static/';
        let imageUris = [];
        let images = [];
        if (this.state.products && this.state.products.length > 0) {
            imageUris = this.state.products.map((item) => {
                return {
                    uri: HOST + item.poster,
                    title: item.title
                };
            })
        }
        images = imageUris.map((item, i) => {
            return (
                <TouchableOpacity style={styles.imageBox} key={i} onPress={()=>{this.chooseProduct(i + 1)}}>
                    <Image style={styles.thumbnailImage} resizeMode='contain' source={{ uri: item.uri }} defaultSource={require( '../../../../assets/logo/pwc_logo_2.png')} />
                    <Text style={styles.imageBox_text} numberOfLines={3}>{ item.title }</Text>
                </TouchableOpacity>
            )
        })
        return images;
    };

    renderSuggestedMerchandise() {
        let HOST = urls.CDN_old + this.state.content + '/static/';
        let imageUris = [];
        let images = [];
        if (this.state.products && this.state.products.length > 0) {
            imageUris = this.state.products.map((item) => {
                return {
                    uri: HOST + item.poster,
                    title: item.title
                };
            })
        }
        images = imageUris.map((item, i) => {
            if(i === 0 || i === 3) {
                return (
                    <TouchableOpacity style={styles.imageBox} key={i} onPress={()=>{this.chooseProduct(i + 1)}}>
                        <Image style={styles.thumbnailImage} resizeMode='contain' source={{ uri: item.uri }} defaultSource={require( '../../../../assets/logo/pwc_logo_2.png')} />
                        <Text style={styles.imageBox_text}>{ item.title }</Text>
                    </TouchableOpacity>
                )
            }
        })
        return images;
    }

    renderPurchaseHistory() {
        let HOST = urls.CDN_old + this.state.content + '/static/';
        let imageUris = [];
        let images = [];
        if (this.state.products && this.state.products.length > 0) {
            imageUris = this.state.products.map((item) => {
                return {
                    uri: HOST + item.poster,
                    title: item.title
                };
            })
        }
        images = imageUris.map((item, i) => {
            if(i === 0) {
                return (
                    <TouchableOpacity style={styles.imageBox} key={i} onPress={()=>{this.chooseProduct(i + 1)}}>
                        <Image style={styles.thumbnailImage} resizeMode='contain' source={{ uri: item.uri }} defaultSource={require( '../../../../assets/logo/pwc_logo_2.png')} />
                        <Text style={styles.imageBox_text}>{ item.title }</Text>
                    </TouchableOpacity>
                )
            }
        })
        return images;
    }

    render() {
        return (
            <View style={styles.shopView}>
                <ScrollView>
                    <View style={[styles.category, styles.category_bottom]}>
                        <View style={styles.categoryTitleBar}>
                            <Text style={styles.categoryTitle}>Selected Content</Text>
                            <Text style={styles.categoryTitleViewAll} onPress={()=>{this.navigateToSelectedContent()}}>VIEW ALL</Text>
                        </View>
                        <View style={styles.categoryScrollView}>
                            <ScrollView style = {{ marginTop : 10 }} horizontal={true}>
                                {
                                    this.renderSelectedContent()
                                }
                            </ScrollView>
                        </View>
                    </View>

                    <View style={[styles.category, styles.category_bottom]}>
                        <View style={styles.categoryTitleBar}>
                            <Text style={styles.categoryTitle}>Suggested Merchandise</Text>
                            <Text style={styles.categoryTitleViewAll} onPress={()=>{this.props.navigateTo('Shop','home','Shop','allProducts','SuggestedMerchandise')}}>VIEW ALL</Text>
                        </View>
                        <View style={styles.categoryScrollView}>
                            <ScrollView style = {{ marginTop : 10 }} horizontal={true}>
                                {
                                    this.renderSuggestedMerchandise()
                                }
                            </ScrollView>
                        </View>
                    </View>

                    <View style={styles.category}>
                        <View style={styles.categoryTitleBar}>
                            <Text style={styles.categoryTitle}>Purchase History</Text>
                            <Text style={styles.categoryTitleViewAll} onPress={()=>{this.props.navigateTo('Shop','home','Shop','allProducts','PurchaseHistory')}}>VIEW ALL</Text>
                        </View>
                        <View style={styles.categoryScrollView}>
                            <ScrollView style = {{ marginTop : 10 }} horizontal={true}>
                                {
                                    this.renderPurchaseHistory()
                                }
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    shopView: {
        flex: 1,
        backgroundColor: '#000'
    },
    category: {
        flex:1,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 5,
    },
    category_bottom: {
        borderBottomWidth: 2,
        borderBottomColor: '#5f5f5f',
    },
    categoryTitleBar:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 22,
    },
    categoryTitle:{
        flex: 1,
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'left',
    },
    categoryTitleViewAll:{
        flex: 1,
        color: '#FFFFFF',
        fontSize: 12,
        textAlign: 'right',
        opacity: 0.8,
    },
    categoryScrollView:{
        flex: 5,
    },
    imageBox: {
        flex: 1,
        width: 100,
        height: 180,
        marginRight: 10,
    },
    thumbnailImage:{
        flex:10,
        width: '100%',
    },
    imageBox_text:{
        flex: 3,
        color: '#FFFFFF',
        fontSize: 10,
        paddingTop: 2,
        paddingBottom: 2,
        height: 28,
    },
});



//---------------    container    -----------------
const mapStateToProps = state => ({
    init: state.init,
    app: state.app,
    hamburgerActions: state.hamburgerActions
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        chooseProduct, navigateTo, getAllProducts, getAllProductsMapping
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(MShopTab);