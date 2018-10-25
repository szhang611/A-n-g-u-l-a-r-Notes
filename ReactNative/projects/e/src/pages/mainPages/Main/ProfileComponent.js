import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-native-spinkit'
import { filterUserAvatar } from "../../../utils/Util";


class ProfileComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDisplayedFriend: '',
            showFriendProfile: false,
        }
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {

    }

    closeProfileCard() {
        this.setState({currentDisplayedFriend: ''});
        this.setState({showFriendProfile: false});
    }

    renderPortraitsList(){
        if(this.state.friendsList.length>0){
            return this.state.friendsList.map((item, idx)=>{
                return (
                    <TouchableOpacity key={idx} style={styles.protraitsListItemGroup} onPress={()=>{this.viewPortraitFromList(item)}}>
                        <Image style={styles.portraitListItemImage} resizeMode='cover' source={{uri: filterUserAvatar(item)}}/>
                        <View style={styles.portraitListNameTextWrapper}>
                            <Text style={[styles.portraitListNameText, commonStyles.FontWeight_bold]} numberOfLines={1}>{item}</Text>
                            <Text style={styles.portraitListNameText} numberOfLines={1}>Watching: <Text>Friends-701</Text></Text>
                        </View>
                    </TouchableOpacity>
                )
            })
        }
    }

    render() {
        return (
            <View style={styles.friendProfileView}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>

                    {
                        this.state.showFriendProfile &&
                        <View style={styles.profileCardWrapper}>
                            <View style={styles.profileCardInnerArea}>

                                <View style={styles.profileAreaLeft}>
                                    <Text style={[styles.userNameInProfile,commonStyles.FontWeight_bold, {height: 120}]}>Picture </Text>
                                    <Text style={[styles.userNameInProfile,commonStyles.FontWeight_bold]}>First name </Text>
                                    <Text style={[styles.userNameInProfile,commonStyles.FontWeight_bold]}>Last name </Text>
                                    <Text style={[styles.userNameInProfile,commonStyles.FontWeight_bold]}>Email address</Text>
                                    <Text style={[styles.userNameInProfile,commonStyles.FontWeight_bold]}>Mobile </Text>
                                    <Text style={[styles.userNameInProfile,commonStyles.FontWeight_bold]}>Geo location </Text>
                                    <Text style={[styles.userNameInProfile,commonStyles.FontWeight_bold]}>Hangout name </Text>
                                    <Text style={[styles.userNameInProfile,commonStyles.FontWeight_bold]}>Hobby </Text>
                                    <Text style={[styles.userNameInProfile,commonStyles.FontWeight_bold]}>Movie </Text>
                                    <Text style={[styles.userNameInProfile,commonStyles.FontWeight_bold]}>Sport </Text>
                                </View>
                                <View style={styles.profileAreaRight}>
                                    <Image source={filterUserAvatar(this.state.currentDisplayedFriend)} style={styles.userAvatarInProfile} resizeMode='cover'/>
                                    <Text style={styles.userNameInProfile} numberOfLines={1}>{this.state.userProfileObj.name.firstName}</Text>
                                    <Text style={styles.userNameInProfile} numberOfLines={1}>{this.state.userProfileObj.name.lastName}</Text>
                                    <Text style={styles.userNameInProfile} numberOfLines={1}>{this.state.userProfileObj.name.displayName}@pwc.com</Text>
                                    <Text style={styles.userNameInProfile} numberOfLines={1}>00100200300</Text>
                                    <Text style={styles.userNameInProfile} numberOfLines={1}>New York</Text>
                                    <Text style={styles.userNameInProfile} numberOfLines={1}>{this.state.currentDisplayedFriend}</Text>
                                    <Text style={styles.userNameInProfile} numberOfLines={1}>Hobby</Text>
                                    <Text style={styles.userNameInProfile} numberOfLines={1}>Movie</Text>
                                    <Text style={styles.userNameInProfile} numberOfLines={1}>Sport</Text>
                                </View>

                            </View>

                            <TouchableOpacity style={styles.closeProfileCardIconWrapper} onPress={()=>{this.closeProfileCard()}}>
                                <Icons
                                    style={styles.closeProfileCardIcon}
                                    name={'close'}
                                    color={'#FFF'}
                                    size={35}
                                />
                            </TouchableOpacity>
                        </View>
                    }


                    {
                        this.state.showPortraitList &&
                        <View style={styles.portraitListView}>
                            <View style={styles.portraitListViewTitle}>
                                <Text style={[styles.portraitListViewTitleText, commonStyles.FontWeight_bold]}>Friends Online</Text>
                            </View>
                            <ScrollView>
                                {
                                    this.renderPortraitsList()
                                }
                            </ScrollView>
                        </View>
                    }

                </View>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    friendProfileView: {
        position: 'absolute',
        top: '9.1%',
        right: 0,
        width: '60%',
        height: '100%',
        zIndex: 123,
        // flex: 1,
    },
    profileCardWrapper: {
        // flex: 4,
        width: '66%',
        position: 'relative',
    },
    portraitListView: {
        // flex: 2,
        width: '34%',
        height: '100%',
        backgroundColor: '#000',
    },
    profileContainer: {

    },
    profileCardInnerArea: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#000',
        height: '100%',
        width: '100%',
    },
    profileAreaLeft: {
        flex: 3,
    },
    profileAreaRight: {
        flex: 5,
    },
    blankUnderProfile: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    closeProfileCardIconWrapper: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: 50,
        height: 50,
        zIndex: 130,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    closeProfileCardIcon: {

    },
    userNameInProfile: {
        color: '#FFF',
        fontSize: 12,
        height: 28,
        lineHeight: 28,
        marginLeft: 20,
    },
    userAvatarInProfile: {
        width: 100,
        height: 100,
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    protraitsListItemGroup: {
        flexDirection: 'row',
        margin: 5,
        backgroundColor: 'transparent',
    },
    portraitListItemImage: {
        flex: 1,
        width: 40,
        height: 40,
    },
    portraitListNameTextWrapper: {
        flex: 4,
        paddingLeft: 5,
    },
    portraitListNameText: {
        color: '#FFF',
        fontSize: 12,
        flex:1,
    },
    portraitListViewTitle: {
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        borderBottomColor: '#666',
        borderBottomWidth: 1,
    },
    portraitListViewTitleText: {
        fontSize: 14,
        color: '#FFF',
    }
});

const commonStyles = StyleSheet.create({
    FontWeight_bold: {
        fontWeight: 'bold',
    },
    Flex3: {
        flex: 3
    },
    Flex5: {
        flex: 5
    },
    Flex7: {
        flex: 7
    },
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
export default connect(mapStateToProps, mapDispatchToProps)(ProfileComponent);