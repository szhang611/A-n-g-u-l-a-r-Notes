import React, { Component } from 'react';
import { StyleSheet, Text, View, AlertIOS, Button, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-native-spinkit'


import { chooseProduct, choose_SelectedContent_Product } from "../../../../../actions/ProductActions";
import { navigateTo } from '../../../../../actions/NavigationAction';
import urls from '../../../../../services/APIUrl';


class MShopTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shopViewAll_loading: false
        }
    }

    componentWillMount() {
        if (this.props.init.allProducts) {
            this.setState({
                products: this.props.init.allProducts,
                content: this.props.init.contentid
            });
            this.setState({shopViewAll_loading: false});
        } else {
            this.setState({shopViewAll_loading: true});
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.init.allProducts) {
            this.setState({
                products: nextProps.init.allProducts,
                content: nextProps.init.contentid
            });
            this.setState({shopViewAll_loading: false});
        } else {
            this.setState({shopViewAll_loading: true});
        }

        if(nextProps.init.allProductsMapping) {
            this.setState({productsMapping: nextProps.init.allProductsMapping});
        }

    }

    chooseProduct(item, idx) {
        console.log(item);
        let sceneID = 1;
        if(this.props.init.allProductsMapping) {
            this.props.init.allProductsMapping.map((mappingItem, idx)=>{
                if(item.productId === mappingItem.productid) {
                    sceneID = mappingItem.scenes[0];
                }
            })
        }
        this.props.choose_SelectedContent_Product(this.props.init, idx, sceneID);
        this.props.navigateTo('Shop','allProducts','Shop','productDetails');
    }

    renderType () {
        switch (this.props.nav.params) {
            case 'SelectedContent':
                return this.renderSelectedContent();
                break;
            case 'SuggestedMerchandise':
                return this.renderSuggestedMerchandise();
                break;
            case 'PurchaseHistory':
                return this.renderPurchaseHistory();
                break;
            default:
                return this.renderSelectedContent();
        }
    }

    renderSelectedContent() {
        let HOST = urls.CDN_old + this.state.content + '/static/';
        let imageUris = [];
        let images = [];
        if (this.state.products && this.state.products.length > 0) {
            imageUris = this.state.products.map((item) => {
                return {
                    uri: HOST + item.poster,
                    title: item.title,
                    productId: item.productId
                };
            })
        }
        images = imageUris.map((item, i) => {
            return (
                <TouchableOpacity style={styles.imageBox} key={i} onPress={()=>{this.chooseProduct(item, i+1)}}>
                    <Image style={styles.thumbnailImage} resizeMode='contain' source={{ uri: item.uri }} defaultSource={require( '../../../../../assets/logo/pwc_logo_2.png')} />
                    <Text style={styles.imageBox_text}>{ item.title }</Text>
                </TouchableOpacity>
            )
        })
        return images;
    }

    renderSuggestedMerchandise () {
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
            if(i === 0 || i === 3){
                return (
                    <TouchableOpacity style={styles.imageBox} key={i} onPress={()=>{this.chooseProduct(i + 1)}}>
                        <Image style={styles.thumbnailImage} resizeMode='contain' source={{ uri: item.uri }}  defaultSource={require( '../../../../../assets/logo/pwc_logo_2.png')} />
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
            if(i === 0){
                return (
                    <TouchableOpacity style={styles.imageBox} key={i} onPress={()=>{this.chooseProduct(i + 1)}}>
                        <Image style={styles.thumbnailImage} resizeMode='cover' source={{ uri: item.uri }}  defaultSource={require( '../../../../../assets/logo/pwc_logo_2.png')} />
                        <Text style={styles.imageBox_text}>{ item.title }</Text>
                    </TouchableOpacity>
                )
            }
        })
        return images;
    }

    render() {
        if(this.state.shopViewAll_loading) {
            return (
                <View style={{flex: 1, justifyContent:'center', alignItems:'center', ...StyleSheet.absoluteFillObject, zIndex: 99, backgroundColor: '#000',}}>
                    <Spinner type={'Circle'} color={'#f1f1f1'} size={60}/>
                </View>
            )
        } else {
            return (
                <View style={styles.shopViewAll}>
                    <View style = {styles.shopNavBar}>
                        <TouchableOpacity style={styles.backIcon} onPress={()=>{this.props.navigateTo('Shop','allProducts','Shop','home')}}>
                            <Icons
                                style={{padding: 3}}
                                name={'navigate-before'}
                                color={'#FFFFFF'}
                                size={36}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.homeIcon} onPress={()=>{this.props.navigateTo('Shop','allProducts','Shop','home')}} >
                            <Icons
                                style={{padding: 3}}
                                name={'home'}
                                color={'#FFFFFF'}
                                size={36}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.allProductsBox}>
                        <ScrollView>
                            <View style={{flex: 1,flexDirection: 'row', flexWrap:'wrap', }}>
                                {
                                    this.renderType()
                                }
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    shopViewAll: {
        flex: 1,
        backgroundColor: '#000',
        paddingBottom: 40,
    },
    shopNavBar: {
        // flex: 1,
        flexDirection : 'row',
        padding: 10,
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
    allProductsBox: {
        marginTop: 15,
        marginLeft: 10,
    },
    imageBox: {
        width: '20%',
        height: 150,
        marginRight: '5%',
        marginBottom: 10,
    },
    thumbnailImage:{
        flex:5,
        width: '100%',
    },
    imageBox_text:{
        flex: 2,
        color: '#FFFFFF',
        fontSize: 12,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 10,
        height: 28,
        width: '90%',
    },
});



//---------------    container    -----------------
const mapStateToProps = state => ({
    init: state.init,
    nav: state.nav,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        chooseProduct, navigateTo, choose_SelectedContent_Product
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(MShopTab);