import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, NetInfo, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as globalStyles from '../../styles/global';
import { login, login_getLocals } from '../../actions/LoginActions';
import { switchComponent } from '../../actions/MainPageActions';

import { filterUserAvatar } from '../../utils/Util';
import { APIService } from "../../services/APIService";

import * as Keychain from 'react-native-keychain';
import {globalEventEmitter, friendsAvatar} from "../../utils/globalEventEmitter";

class LoginBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            showError: false,
            errorMsg: '',
            hasClickedLogin: false,
            loginButtonMsg: 'Login',
            isConnected: true,
            avatar: null,
            keychainUsername: '',
            showRealUserAvatar: false,
        };
        this.setupKainChain();
        
    }

    async setupKainChain(){
        try {
            // Retreive the credentials
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
              console.log('Credentials successfully loaded for user ' + credentials.username);
              this.setState(
                  {
                    username: credentials.username,
                    password: credentials.password,
                    avatar: filterUserAvatar(credentials.username.toLowerCase()),
                    keychainUsername: credentials.username,
                    showRealUserAvatar: true,
                  }
              )
            } else {
              console.log('No credentials stored');
                this.setState({avatar: filterUserAvatar(this.state.username.toLowerCase())});
            }
          } catch (error) {
            console.log('Keychain couldn\'t be accessed!', error);
          }
    }

    // invoked when the component will mount
    componentWillMount() {
        let timeout = 'invalid username or password, please try again.';
        if (this.props.failReason) {
            this.setState({
                showError: true,
                errorMsg: this.props.failReason === timeout ? 'Response Timeout. Please Try Again.' : this.props.failReason
            })
        } else {
            this.setState({
                showError: false
            })
        }
        this.props.switchComponent('Home');
    }

    // invoked when the props changed
    componentWillReceiveProps(nextProps) {
        let timeout = 'invalid username or password, please try again.';
        if (nextProps.failReason) {
            this.setState({
                showError: true,
                errorMsg: nextProps.failReason === timeout ? 'Response Timeout. Please Try Again.' : nextProps.failReason,
                loginButtonMsg: 'Login',
                hasClickedLogin: false,
            }, async() => {
                await Keychain.resetGenericPassword()
            })
        } else {
            this.setState({
                showError: false
            })
        }
        if(!nextProps.hasLogin) {
            this.setState({
                hasClickedLogin: false,
                loginButtonMsg: 'Login'})
        }
    }

    componentDidMount() {
        // check, whether the network is initially connected or not
        const onInitialNetConnection = isConnected => {
            console.log(`Is network initially connected: ${isConnected}`);
            if(isConnected) {
                this.setState({showError: false , isConnected: true} );
                this.setState({isConnected: true});
            } else {
                this.setState({
                    showError: true,
                    errorMsg: 'Disconnected from the network'
                });
                this.setState({isConnected: false})
            }
            NetInfo.isConnected.removeEventListener(
                onInitialNetConnection
            );
        };
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            onInitialNetConnection
        );

        globalEventEmitter.addListener('loginFailReason', (reason)=>{
            this.setState({
                showError: true,
                errorMsg: reason,
                loginButtonMsg: 'Login',
                hasClickedLogin: false,
            }, async() => {
                await Keychain.resetGenericPassword()
            })
        });

        this.getFriendsAvatarList();
    }


    async getFriendsAvatarList(){
        let res = await APIService.getFriendsAvatarList();
        if(res && res.socialResponse) {
            friendsAvatar.socialResponse = res.socialResponse;
        }
    }

    // login action
    login = () => {
        this.props.failReason = '';
        if (this.state.username == '' || this.state.password == '') {
            this.setState({
                showError: true,
                errorMsg: `username or password can't be empty`
            })
            return;
        }
        if(!this.state.isConnected) {
            return;
        }
        if ( !this.state.hasClickedLogin ) {
            this.setState({hasClickedLogin: true, errorMsg: ''});
            this.setState({loginButtonMsg: 'Logging in, please wait...'}, async ()=> {
                await Keychain.setGenericPassword(this.state.username , this.state.password);
            })

            // AsyncStorage.getItem('USER_ID', (_id) => {
            //     if(!_id) {
                    this.props.login(this.state.username, this.state.password);
                // } else {
                //     this.props.login_getLocals()
                // }
            // })
        }
    }

    renderComponent(flag) {
        if (flag) {
            return (
                <View><Text style={{ color: 'red' }}>{this.state.errorMsg}</Text></View>
            )
        } else {
            return <Text />
        }
    }

    onchangeUsername(text) {
        this.setState({
            username: text,
            showRealUserAvatar: text.toLowerCase() === this.state.keychainUsername.toLowerCase()
        });
    }

    render() {
        return (
            <KeyboardAvoidingView style={[styles.box]} behavior="padding">
                <View style={[styles.title]}>
                    <Text style={styles.titleFont}>Login</Text>
                </View>
                <View style={styles.body}>
                    {
                        this.state.showRealUserAvatar &&
                        <Image style={[styles.image]} source={{uri: this.state.avatar}} defaultSource={require('../../assets/logo/profile.png')}/>
                    }
                    {
                        !this.state.showRealUserAvatar &&
                        <Image style={[styles.image]} source={require('../../assets/logo/profile.png')}/>
                    }
                    <View style={[styles.fullWidth]}>
                        <Text style={[styles.label]}>Username</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => this.onchangeUsername(text)}
                            value={this.state.username}
                        />
                    </View>
                    <View style={[styles.fullWidth]}>
                        <Text style={[styles.label]}>Password</Text>
                        <TextInput secureTextEntry
                                   style={styles.input}
                                   onChangeText={text => this.setState({ password: text })}
                                   value={this.state.password}
                        />
                    </View>
                    <View style={[styles.actions, styles.fullWidth]}>
                        <TouchableOpacity
                            onPress={this.login}
                            style={[styles.button]}
                        >
                            <Text>{this.state.loginButtonMsg}</Text>
                            {/*<Text>Login</Text>*/}
                        </TouchableOpacity>
                        {/* <Text style={[styles.forget]}>Forget Password?</Text> */}
                    </View>
                    <View style={{ alignSelf: 'flex-start', marginTop: 15 }}>
                        {this.renderComponent(this.state.showError)}
                    </View>
                </View>
                <View style={{height: 50}}/>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    forget: {
        color: 'blue',
    },
    actions: {
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    fullWidth: {
        width: '100%'
    },
    button: {
        borderWidth: 1,
        borderColor: globalStyles.DARK_GRAY,
        borderStyle: 'solid',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 2,

    },
    buttonText: {
        fontSize: 16,
        color: globalStyles.BLACK,
        fontFamily: globalStyles.fontFamily
    },
    label: {
        marginTop: 8
    },
    input: {
        borderWidth: 1,
        borderColor: globalStyles.DARK_GRAY,
        borderStyle: 'solid',
        lineHeight: 2,
        fontSize: 14,
        padding: 8,
        marginVertical: 12
    },
    box: {
        flex: 1,
        alignItems: 'center'
    },
    title: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderBottomWidth: 4,
        borderBottomColor: globalStyles.DARK_GREEN,
        borderStyle: 'solid',
        alignItems: 'center'
    },
    titleFont: {
        fontSize: 24,
        color: globalStyles.WHITE,
        fontFamily: globalStyles.fontFamily,
        fontWeight: 'bold'
    },
    body: {
        borderWidth: 4,
        borderColor: globalStyles.DARK_GREEN,
        borderStyle: 'solid',
        marginTop: 12,
        paddingVertical: 22,
        paddingHorizontal: 33,
        backgroundColor: globalStyles.WHITE,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    image: {
        height: 150,
        width: 150,
        borderRadius: 75,
        marginTop: 10,
        marginBottom: 30,
    }
});



//---------------    container    -----------------
const mapStateToProps = state => ({
    failReason: state.app.failReason // default: ''
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        login, switchComponent, login_getLocals
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(LoginBox);

