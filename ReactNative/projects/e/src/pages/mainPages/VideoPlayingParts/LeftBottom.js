import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, AsyncStorage, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { chooseProduct } from '../../../actions/ProductActions';
import { navigateTo } from '../../../actions/NavigationAction';
import { sendSocialMessages,jointChatRoom } from '../../../actions/SocialActions';
import urls from '../../../services/APIUrl';
import { globalEventEmitter, globalTabSwitchState } from '../../../utils/globalEventEmitter';

import e3_icon from '../../../assets/logo/social/E3-icon.png'
import Instagram_icon from '../../../assets/logo/social/Instagram_icon.png'
import facebook_icon from '../../../assets/logo/social/facebook_icon.png'
import twitter_icon from '../../../assets/logo/social/twitter_icon.png'



export class LeftBottom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: null,
            content: '',
            currentSocialType: '',
        }
    }

    componentWillMount() {
        if(this.props.hamburgerActions.Live_CurrentVideoName) {
            this.setState({content: this.props.hamburgerActions.Live_CurrentVideoName})
        }
        if(this.props.hamburgerActions.Recorded_CurrentVideoName) {
            this.setState({content: this.props.hamburgerActions.Recorded_CurrentVideoName})
        }
    }

    chooseProduct(id) {
        this.props.chooseProduct(this.props.init, id);
        this.props.navigateTo('Shop','Home','Shop','productDetails');

        globalTabSwitchState.shop = true;
        globalEventEmitter.emit('tabSwitchStatus_OtherEmit', globalTabSwitchState);
    }

    componentDidMount() {
        if (this.props.init.products) {
            this.setState({products: this.props.init.products});
        } else {
            this.setState({products: []});
        }

        globalEventEmitter.addListener('NavigateToSocialChat', (flag)=>{
            this.setState({
                navigateToSocialChat : flag
            }, ()=> {
                this.navigateToSocial('E3')
            })
        });
        globalEventEmitter.addListener('clearSocialTab', () => {
            this.setState({
                currentSocialType : ''
            })
        });

        globalEventEmitter.addListener('startLeftTopPlaying', ()=>{
            this.setState({content: this.props.init.contentid});
        });

        globalEventEmitter.addListener('replaceLeftTopVideoByLeftBottomShared', (res)=>{
            this.setState({content: res.contentid});
        });

        globalEventEmitter.addListener('startLeftBottomPlaying', ()=>{
            if(this.props.leftBottomVideoName) {  // OTT only (temp)
                this.setState({content: this.props.leftBottomVideoName});
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.init.products) {
            this.setState({products: nextProps.init.products});
        } else {
            this.setState({products: []});
        }
         
    }

    renderProductsImages = (products) => {
        if(products) {
            let HOST = urls.CDN_old + this.state.content + '/static/';
            let imageUris = [];
            let images = [];
            if (products && products.length > 0) {
                imageUris = products.map((item) => {
                    return HOST + item.poster;
                });
                images = imageUris.map((uri, i) => {
                    return (
                        <TouchableOpacity key={i} style={styles.productsImageWrap} onPress={() => { this.chooseProduct(i + 1) }}>
                            <Image source={{ uri: uri }} resizeMode='contain' style={styles.productImages}  defaultSource={require('../../../assets/logo/pwc_logo_2.png')}/>
                        </TouchableOpacity>
                    )
                });
                return images;
            }
        } else {
            return <View />
        }
    };

    // only show products for 'retail' tab
    renderProductsComponent = () => {
        return (
            <View style={styles.productsGroupBox}>
                <View style={styles.productsWrapper}>
                    <ScrollView>
                        <View style={styles.productScrollInteriorView}>
                            {this.renderProductsImages(this.state.products)}
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }

    navigateToSocial(socialType, currentTab) {
        AsyncStorage.getItem('USER_ID').then((id)=>{
            AsyncStorage.getItem('WATCHING_NOW').then((res)=>{
                watching_now =  JSON.parse(res)
                if (!watching_now.isFired) {
                    if( socialType !== this.state.currentSocialType && socialType === 'E3'){
                        watching_now.isFired = true
                        AsyncStorage.setItem('WATCHING_NOW', JSON.stringify(watching_now))
                        this.props.jointChatRoom(this.props.socket, id, watching_now)
                    }
                }

                this.setState({currentSocialType: socialType})
                this.props.navigateTo('','','Social','home', socialType);

                globalTabSwitchState.social = true;
                globalEventEmitter.emit('tabSwitchStatus_OtherEmit', globalTabSwitchState);
            });
        });
    }

    sendSocialMessages() {
        // this.props.sendSocialMessages(this.state.currentSocialType, this.state.text);
    }


    render() {
        return (
            <View style={styles.body}>
                {this.renderProductsComponent()}
                <View style={styles.socialBox}>
                    <Text style={styles.socialTitle}>Social</Text>
                    <View style={styles.ItemsUnderInputBox}>
                        <View style = {styles.logoGroup}>
                            <TouchableOpacity style = {styles.ImageBox} onPress={()=>{this.navigateToSocial('E3')}}>
                                <Image source={e3_icon} style={styles.logoImage} />
                            </TouchableOpacity>
                            <TouchableOpacity style = {styles.ImageBox} onPress={()=>{this.navigateToSocial('Twitter')}}>
                                <Image source={twitter_icon} style={styles.logoImage} />
                            </TouchableOpacity>
                            <TouchableOpacity style = {styles.ImageBox} onPress={()=>{
                                this.navigateToSocial('Facebook')
                            }}>
                                <Image source={facebook_icon} style={styles.logoImage} />
                            </TouchableOpacity>
                            <TouchableOpacity style = {styles.ImageBox} onPress={()=>{this.navigateToSocial('Instagram')}}>
                                <Image source={Instagram_icon} style={styles.logoImage} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    body: {
        flex: 2,
        backgroundColor: '#282828',
        position: 'relative',
    },
    productsWrapper: {
        flex: 1,
        width: '100%',
    },
    productsScrollView: {
        height : '60%',
        width: '100%',
    },
    productScrollInteriorView: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
    },
    productsImageWrap: {
        width: '30%',
        height: 90,
        marginLeft: 10,
        marginBottom: 10,
    },
    productImages: {
        width: '100%',
        height: '100%',
    },
    productsGroupBox: {
        flex: 3,
    },
    socialBox: {
        marginTop: 5,
        flex: 1,
        // backgroundColor:'#7e2',
    },
    socialTitle: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 10,
        textAlign: 'left',
    },
    socialTextInput: {
        height: 100,
        padding: 8,
        margin: 1,
        borderWidth: 1,
        borderColor: '#999',
        backgroundColor: '#fff',
        textAlignVertical: 'top',
        fontSize: 12,
    },
    ItemsUnderInputBox: {
        marginTop: 5,
        flexDirection: 'row',
    },
    logoGroup: {
        flexDirection : 'row',
        flex: 3,
        justifyContent: 'flex-start',
        marginLeft: 12,
    },
    ImageBox: {
        marginRight: 12,
    },
    logoImage: {
        height: 30,
        width: 30,
    },
    sendWrapper: {
        flex: 2,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight:12,
    },
    sendBox: {
        width: 66,
        height: 28,
        borderWidth: 1,
        borderColor: '#FFF',
    },
    sendTxt: {
        color: '#FFF',
        textAlign:'center',
        lineHeight: 26,
    },
});


//---------------    container    -----------------
const mapStateToProps = state => ({
    app: state.app,
    init: state.init,
    hamburgerActions: state.hamburgerActions,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        chooseProduct, navigateTo, sendSocialMessages,jointChatRoom
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(LeftBottom);


