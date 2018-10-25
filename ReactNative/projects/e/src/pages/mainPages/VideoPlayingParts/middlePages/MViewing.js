import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icons from 'react-native-vector-icons/MaterialIcons';

import { APIService } from '../../../../services/APIService';
import AllUrls from '../../../../services/APIUrl';
import { toHHMMSS } from '../../../../utils/Util';
import {globalEventEmitter} from "../../../../utils/globalEventEmitter";


class MViewing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: '',
            viewListItems: [],
        }
    }

    componentWillMount() {
        AsyncStorage.getItem('USER_ID').then((uid)=>{
            this.setState({uid: uid});
            this.getFriendsWatchingList(uid);
        });
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {

    }

    componentWillUnmount() {
        globalEventEmitter.emit('endViewingVideo', null);
    }

    async getFriendsWatchingList(uid) {
        let tempList = [];
        let res = await APIService.getFriendsWatchingList(uid);
        console.log(res);
        if(res.status === 'success' && res.socialResponse) {
            let socialRes = res.socialResponse;
            Object.keys(socialRes).map((item)=>{
                let temp = socialRes[item];
                temp = {...temp, user: temp.user, poster: AllUrls.videoThumbnailImage(temp.contentid, 1, 'thumbnail.jpg')};
                tempList.push(temp);
            });
            this.setState({viewListItems: tempList});
        }
    }

    handleVideoClick(item) {
        globalEventEmitter.emit('startViewingVideo', item);
    }

    refreshList() {
        this.getFriendsWatchingList(this.state.uid);
    }

    renderImageBox() {
        if(this.state.viewListItems && this.state.viewListItems.length > 0) {
            return this.state.viewListItems.map((item, idx) => {
                if(item.video && item.video.offset && item.contentid) {
                    return (
                        <TouchableOpacity key={idx} style={styles.queueListItem} onPress={() => {
                            this.handleVideoClick(item)
                        }}>
                            <Image style={styles.productImages} resizeMode='cover' source={{uri: item.poster}} defaultSource={require(  '../../../../assets/logo/pwc_logo_2.png')} />
                            <Text style={styles.imageBox_text}>{'Friend: ' + item.user}</Text>
                            <Text style={styles.imageBox_text}>{item.contentid}</Text>
                            <Text style={styles.imageBox_text}>Time: {toHHMMSS(item.video.offset)}</Text>
                        </TouchableOpacity>
                    )
                }
            })
        }
    }

    render() {
        return (
            <View style={styles.viewingView}>
                <View style={styles.viewTop}>
                    <TouchableOpacity style={styles.refreshButton} onPress={()=>{this.refreshList()}}>
                        <Icons name={'refresh'} size={24} color={'#FFF'}/>
                        <Text style={styles.refreshText}>Refresh</Text>
                    </TouchableOpacity>
                    <View style={styles.listScrollViewWrapper}>
                        <ScrollView style={styles.viewingViewScrolled} horizontal={true}>
                            {
                                this.renderImageBox()
                            }
                        </ScrollView>
                    </View>
                </View>

                <View style={styles.viewBottom}>

                </View>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    viewingView: {
        flex: 1,
        backgroundColor: '#000',
    },
    viewTop: {
        flex: 35,
    },
    viewBottom: {
        flex: 65,
    },
    listScrollViewWrapper: {
        flex: 5,
    },
    viewingViewScrolled: {
        marginTop: 5,
        marginBottom : 5
    },
    queueListItem: {

    },
    productImages: {
        marginLeft: 5,
        paddingLeft: 5,
        paddingTop: 5,
        width:  200,
        height: '70%',
    },
    imageBox_text:{
        flex: 1,
        color: '#FFFFFF',
        fontSize: 10,
        lineHeight: 14,
        textAlign:'center',
    },
    refreshButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    refreshText: {
        color: '#FFF',
        fontSize: 14,
        marginLeft: 5,
    }
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
export default connect(mapStateToProps, mapDispatchToProps)(MViewing);