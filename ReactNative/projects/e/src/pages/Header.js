import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, AlertIOS, Alert, AsyncStorage } from 'react-native';
// import ReactNativeComponentTree from 'react-native/Libraries/Renderer/shims/ReactNativeComponentTree';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icons from 'react-native-vector-icons/MaterialIcons'
import { filterUserAvatar } from '../utils/Util'
import {onlineUsersImageRange} from '../actions/SocialActions'
import VersionNumber from 'react-native-version-number';

class Header extends Component {
    constructor(props) {
        super(props);
        this.highlightAvatar = [];
    }

    state = {
        showMenuList: false,
        count: 0,
        displayMoreHorizIcon: false,
    };

    componentWillMount() {
        this.setState({displayMoreHorizIcon: (this.props.friendsList.length > 3)});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.global && nextProps.global.ebuCoreMain) {
            this.setState({
                title: (nextProps.global.ebuCoreMain[0].coreMetadata.title[0].title[0].value),
                // date: (nextProps.global.ebuCoreMain[0].coreMetadata.date[0].released.date).substring(0, 4),
                // director: nextProps.global.ebuCoreMain[0].coreMetadata.director[0].Name[0].value,
                // rating: nextProps.global.ebuCoreMain[0].coreMetadata.rating[0].typeDefinition,
                // typeGene: nextProps.global.ebuCoreMain[0].coreMetadata.type[0].genre[0].typeDefinition,
                runtime: nextProps.global.ebuCoreMain[0].coreMetadata.runtime[0].runtime[0].value
            })
        }
        if(nextProps.init.MoveOnAvatarNumber_Header > 0) {
            this.resetHighlight();
            let listLength = this.props.friendsList.length;
            if(this.props.friendsList.length > 3) {
                listLength = 3;
            }
            let difff = listLength - nextProps.init.MoveOnAvatarNumber_Header;
            if(difff > 0){
                this.highlightAvatar[difff] = true;
            }
            console.log(this.highlightAvatar);
        } else if(nextProps.init.MoveOnAvatarNumber_Header === 0){
            this.resetHighlight();
        }
    }

    resetHighlight() {
        if(this.props.friendsList.length === 2){
            this.highlightAvatar = [false,false]; // left to right
        } else if(this.props.friendsList.length >= 3){
            this.highlightAvatar = [false,false,false];
        }
    }

    componentDidMount() {
        
    }

    toggleMenuList(){
        this.setState({showMenuList: !this.state.showMenuList},()=>{
            this.props.emitToggleHamburger(true);
        });
    }
    toggleFriendProfile(username) {
        this.props.emitToggleFriendProfile(username);
    }

    renderPortraits(){
        let images = [];
        if(this.props.friendsList.length>0){
            let _list = this.props.friendsList;
            if(this.props.friendsList.length > 3) {
                _list = this.props.friendsList.slice(0,3);
            } else {
            }
            images = _list.map((item, idx)=>{
                return (
                    <TouchableOpacity style={styles.portraitImageWrapper} key={idx} onPress={()=>{this.toggleFriendProfile(item.userId)}}>
                        <Image resizeMode='cover' source={{uri :filterUserAvatar(item.userId)}} style={[styles.portraitImage, this.highlightAvatar[idx] ? styles.HighlightBorder : {}]}  defaultSource={require( '../assets/logo/default_portrait.png')} />
                    </TouchableOpacity>
                )
            });
            return images;
        }
    }


    onPressMoreHorizIcon() {
        this.props.emitDisplayPortraitList(true)
    }
    

    renderTitle() {
        if (this.props.hamburgerActions.hamburgerMenuSelect === 'Live' || this.props.hamburgerActions.hamburgerMenuSelect === 'Recorded') {
            if(this.props.hamburgerActions.Live_CurrentVideoName !== '' || this.props.hamburgerActions.Recorded_CurrentVideoName !== '') {
                return this.state.title;
            }
        } else {
            return '';
        }
    }

    renderRuntime() {
        return (
            <View style={styles.timeContainer}>
                <View style={{borderBottomColor: '#FFFFFF', borderBottomWidth: 1, padding: 2}}>
                    <Text style={styles.timeText}>Version</Text>
                </View>
                <View style={{padding: 2}}>
                    <Text style={styles.timeText}>{VersionNumber.appVersion}</Text>
                </View>
            </View>
        )
    }

    renderUnreadMessages() {
        let totalCount = 0 
        for (userId in this.props.unreadMessages){
            totalCount = totalCount + this.props.unreadMessages[userId]
        }
            if(totalCount === 0 ){
                return ;
            }
            return ( <View style = {{backgroundColor:'red', position:'absolute', zIndex : 4,  justifyContent: 'center',  width: 20, height: 20, right:5 , top: 5 , overflow: "hidden",borderRadius: 10 , borderColor: '#fff'}}>
                                    <Text style ={{ color : '#fff', fontWeight:'900', justifyContent: 'center', alignItems :'center', width: 20, height: 20, left : 2}}> {totalCount > 99 ? '...' : totalCount}  </Text> 
                    </View>) 
        
    }

    render() {
        return (
            <View style={[this.props.style]}
                  onLayout={(event) => {
                      let {x, y, width, height} = event.nativeEvent.layout;
                      AsyncStorage.setItem('HeaderHeight', height.toString());
                  }}>

                <View style={styles.headerContainer} >

                    <TouchableOpacity style={styles.hamburgerMenuIcon} onPress={()=>{this.toggleMenuList()}}>
                        <Icons
                            style={{padding: 3}}
                            name={'menu'}
                            color={'#FFFFFF'}
                            size={36}
                        />
                    </TouchableOpacity>


                    <View style={styles.titleContainer}>
                        <Text style={styles.titleItem}>{this.renderTitle()}</Text>
                    </View>


                    {this.renderRuntime()}

                    <View style={styles.portraitsContainer}>
                        <View style={styles.portraitsGroup}>
                            <ScrollView horizontal={true}>
                                {this.renderPortraits()}
                            </ScrollView>
                        </View>
                        {
                            !this.props.showPortraitList &&
                            <TouchableOpacity style={styles.morePortraits} onPress={() => this.onPressMoreHorizIcon()}>
                                {this.renderUnreadMessages()}
                                <Icons
                                    name="more-horiz"
                                    size={40}
                                    color={'#FFF'}
                                />
                            </TouchableOpacity>
                        }
                        {
                            this.props.showPortraitList &&
                            <TouchableOpacity style={styles.morePortraits} onPress={() => this.onPressMoreHorizIcon()}>
                                <Icons
                                    name="close"
                                    size={40}
                                    color={'#FFF'}
                                />
                            </TouchableOpacity>
                        }
                    </View>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        backgroundColor: '#000000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hamburgerMenuIcon:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 7,
    },
    logoContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 15
    },
    logo: {
        height: 40,
        width: 70,
    },
    titleContainer: {
        flex: 6,
        // width: '75%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleItem: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: '2.5%'
    },
    timeContainer:{
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeText:{
        color: '#FFFFFF',
        fontSize: 12,
    },
    portraitsContainer:{
        flex: 3,
        flexDirection:'row',
    },
    portraitsGroup: {
        flex: 4,
        alignItems: 'flex-end',
    },
    portraitImageWrapper: {
        flex: 1,
        width: 45,
        height: 45,
        marginRight: 5,
    },
    portraitImage: {
        flex: 1,
        width: '100%',
        marginRight: 5,
    },
    logout: {
        flex: 1,
        width: '10%'
    },
    morePortraits: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        marginRight: 5,
        flex: 1,
    },
    HighlightBorder: {
        borderWidth: 1,
        borderColor: '#48ff42',
    }
});


//---------------    container    -----------------
const mapStateToProps = state => ({
    global: state.init.globalMD,
    hamburgerActions: state.hamburgerActions,
    socialMsg: state.socialMsg,
    init: state.init,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        onlineUsersImageRange
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(Header);
