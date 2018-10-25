import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import {
    View,
    Text,
    Platform,
    PermissionsAndroid,
    Dimensions,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView
} from "react-native";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import Ionicons from "react-native-vector-icons/Ionicons";
import Sound from "react-native-sound";
import NavigationBar from "react-native-navbar";
import {globalEventEmitter} from '../../../../../utils/globalEventEmitter'
import {emitP2PMessages} from '../../../../../actions/SocialActions'
import { filterUserAvatar } from '../../../../../utils/Util'

const ImagePicker = require("react-native-image-picker");

class P2PMessage extends Component {

    state = {
        messages: [],
        startAudio: false,
        hasPermission: false,
        audioPath: `${
            AudioUtils.DocumentDirectoryPath
            }/${this.messageIdGenerator()}test.aac`,
        playAudio: false,
        fetchChats: false,
        audioSettings: {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            MeteringEnabled: true,
            IncludeBase64: true,
            AudioEncodingBitRate: 32000
        }
    };
    componentWillMount() {

        this.props.socket.on('P2PmessageNotify',  this.notifyNewMessage)
        this.props.receiver && this.props.socket.emit('JoinP2PMessage',this.props.receiver.userId)

        
    }
    componentDidMount() {
        // this.checkPermission().then(async hasPermission => {
        //     this.setState({ hasPermission });
        //     if (!hasPermission) return;
        //     await AudioRecorder.prepareRecordingAtPath(
        //         this.state.audioPath,
        //         this.state.audioSettings
        //     );
        //     AudioRecorder.onProgress = data => {
        //         console.log(data, "onProgress data");
        //     };
        //     AudioRecorder.onFinished = data => {
        //         console.log(data, "on finish");
        //     };
        // });
    }
    componentWillUnmount() {
        this.setState({
            messages: []
        });
        this.props.socket.removeListener('P2PmessageNotify',  this.notifyNewMessage)
 
    }

    onReceivedMessage(messages){
        // debugger
        console.log(this.props, "chat props")
        messages = messages.map(node => {
            console.log(node, "node")
            const message = {};
            message._id = node._id;
            message.text = node.messageType === "message" ? node.text : "";
            message.createdAt = node.createdAt;
            message.user = {
                _id: node.user._id,
                name: node.user.name,
                avatar: node.user.avatar
            };
            message.image = node.messageType === "image" ? node.image : "";
            message.audio = node.messageType === "audio" ? node.audio : "";
            message.messageType = node.messageType;
 
            return message;
        });
        
        newMessage = GiftedChat.append(this.state.messages, messages)

        // 
        this.setState(
            {
                messages: newMessage
            }
        )
    }

    checkPermission() {
        if (Platform.OS !== "android") {
            return Promise.resolve(true);
        }
        const rationale = {
            title: "Microphone Permission",
            message:
                "AudioExample needs access to your microphone so you can record audio."
        };
        return PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            rationale
        ).then(result => {
            console.log("Permission result:", result);
            return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
        });
    }


    onSend(messages = []) {
        messages[0].messageType = "message";
        // this.socket.emit('message', messages[0]);
        this.props.emitP2PMessages(this.props.socket, messages[0], this.props.receiver);
        this._storeMessages(messages);
    }

    notifyNewMessage = (senderId, messages) => {
        this.onReceivedMessage(messages);
        globalEventEmitter.emit('clearUnreadMessages', senderId)
    } 

    renderName = props => {
        // debugger
        const { user: self } = this.props; // where your user data is stored;
        const { user = {} } = props.currentMessage;
        const { user: pUser = {} } = props.previousMessage;
        const isSameUser = pUser._id === user._id;
        const isSelf = user._id === self;
        const shouldNotRenderName = isSameUser;
        let disPlayName =  user._id;
        let lastName = ""
        return shouldNotRenderName ? (
            <View />
        ) : (
                <View>
                    <Text style={{ color: "grey", padding: 2, alignSelf: "center" }}>
                        {`${disPlayName} `}
                    </Text>
                </View>
            );
    };
    renderAudio = props => {
        return !props.currentMessage.audio ? (
            <View />
        ) : (
                <Ionicons
                    name="ios-play"
                    size={35}
                    color={this.state.playAudio ? "red" : "blue"}
                    style={{
                        left: 90,
                        position: "relative",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.5,
                        backgroundColor: "transparent"
                    }}
                    onPress={() => {
                        this.setState({
                            playAudio: true
                        });
                        const sound = new Sound(props.currentMessage.audio, "", error => {
                            if (error) {
                                console.log("failed to load the sound", error);
                            }
                            this.setState({ playAudio: false });
                            sound.play(success => {
                                console.log(success, "success play");
                                if (!success) {
                                    Alert.alert("There was an error playing this audio");
                                }
                            });
                        });
                    }}
                />
            );
    };
    renderBubble = props => {
        return (
            <View>
                {this.renderName(props)}
                {/* {this.renderAudio(props)} */}
                <Bubble {...props} />
            </View>
        );
    };
    handleAvatarPress = props => {
        // add navigation to user's profile
    };
    handleAudio = async () => {
        const { user } = this.props;
        if (!this.state.startAudio) {
            this.setState({
                startAudio: true
            });
            await AudioRecorder.startRecording();
        } else {
            this.setState({ startAudio: false });
            await AudioRecorder.stopRecording();
            const { audioPath } = this.state;
            const fileName = `${this.messageIdGenerator()}.aac`;
            const file = {
                uri: Platform.OS === "ios" ? audioPath : `file://${audioPath}`,
                name: fileName,
                type: `audio/aac`
            }; 
            const message = {};
                    message._id = this.messageIdGenerator();
                    message.createdAt = Date.now();
                    message.user = {
                        _id: user,
                        name:   user,
                        avatar: filterUserAvatar(user)
                    };
                    message.text = "";
                    message.audio =  file.uri
                    message.messageType = "audio";

                    this.setState({
                        messages: [message, ...this.state.messages]
                    });
        }
    };
    messageIdGenerator() {
        // generates uuid.
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    sendChatToDB(data) {
        // send your chat to your db
    }
    handleAddPicture = () => {
        const { user } = this.props; // wherever you user data is stored;
        const options = {
            title: "Select Profile Pic",
            mediaType: "photo",
            takePhotoButtonTitle: "Take a Photo",
            maxWidth: 256,
            maxHeight: 256,
            allowsEditing: true,
            noData: true
        };
        ImagePicker.showImagePicker(options, response => {
            console.log("Response = ", response);
            if (response.didCancel) {
                // do nothing
            } else if (response.error) {
                // alert error
            } else {
                const { uri } = response;
                const extensionIndex = uri.lastIndexOf(".");
                const extension = uri.slice(extensionIndex + 1);
                const allowedExtensions = ["jpg", "jpeg", "png"];
                const correspondingMime = ["image/jpeg", "image/jpeg", "image/png"];
           
                const file = {
                    uri,
                    name: `${this.messageIdGenerator()}.${extension}`,
                    type: correspondingMime[allowedExtensions.indexOf(extension)]
                };

                //upload to server side

                const message = {};
                        message._id = this.messageIdGenerator();
                        message.createdAt = Date.now();
                        message.user = {
                            _id: user,
                            name: `${user} ${user}`,
                            avatar: user
                        };
                        message.image = uri
                        message.messageType = "image";

                        this.setState({
                            messages: [message, ...this.state.messages]
                        });
                if (!allowedExtensions.includes(extension)) {
                    return alert("That file type is not allowed.");
                }
            }
        });
    };
    renderAndroidMicrophone() {
        if (Platform.OS === "android") {
            return (
                <Ionicons
                    name="ios-mic"
                    size={35}
                    hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                    color={this.state.startAudio ? "red" : "black"}
                    style={{
                        bottom: 50,
                        right: Dimensions.get("window").width / 2,
                        position: "absolute",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.5,
                        zIndex: 2,
                        backgroundColor: "transparent"
                    }}
                    onPress={this.handleAudio}
                />
            );
        }
    }
    renderLoading() {
        if (!this.state.messages.length && !this.state.fetchChats) {
            return (
                <View style={{ marginTop: 100 }}>
                    <ActivityIndicator color="black" animating size="large" />
                </View>
            );
        }
    }
    // Helper functions
    _storeMessages(messages) {
        this.setState((previousState) => {
        return {
            messages: GiftedChat.append(previousState.messages, messages),
        };
        });
    }

    render() {
        const { user } = this.props; // wherever you user info is
        console.log('chat render', user)
        const rightButtonConfig = {
            title: 'Add photo',
            handler: () => this.handleAddPicture(),
        };
        return (
            <View style={{ flex: 1}}>
                {/* <NavigationBar
                    title={{ title: "chat" }}
                    rightButton={rightButtonConfig}
                /> */}
                {/* {this.renderLoading()} */}
                {/* {this.renderAndroidMicrophone()} */}
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    alwaysShowSend
                    showUserAvatar
                    isAnimated
                    showAvatarForEveryMessage
                    renderBubble={this.renderBubble}
                    messageIdGenerator={this.messageIdGenerator}
                    onPressAvatar={this.handleAvatarPress}
                    // renderActions={() => {
                    //     if (Platform.OS === "ios") {
                    //         return (
                    //             <Ionicons
                    //                 name="ios-mic"
                    //                 size={35}
                    //                 hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                    //                 color={this.state.startAudio ? "red" : "black"}
                    //                 style={{
                    //                     bottom: 50,
                    //                     right: 200,
                    //                     position: "absolute",
                    //                     shadowColor: "#FFF",
                    //                     shadowOffset: { width: 0, height: 0 },
                    //                     shadowOpacity: 0.5,
                    //                     zIndex: 22,
                    //                     backgroundColor: "transparent"
                    //                 }}
                    //                 onPress={this.handleAudio}
                    //             />
                    //         );
                    //     }
                    // }}
                    user={{
                        _id: user, 
                        name: user,
                        avatar: filterUserAvatar(user)
                    }}
                />
                <KeyboardAvoidingView />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    init: state.init,
    nav: state.nav,
    socialMsg: state.socialMsg,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        emitP2PMessages
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(P2PMessage);