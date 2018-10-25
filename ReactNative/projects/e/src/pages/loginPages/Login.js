import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import * as globalStyles from '../../styles/global';
import Logo from './Logo';
import LoginBox from './LoginBox';

/**
 * Login Page
 */
export default class Login extends Component {
    render() {
        return (
            <View style={[styles.containerLayout, styles.container]}>
                <View style={[styles.leftLayout]}>
                    <Logo />
                </View>
                <View style={[styles.rightLayout]}>
                    <LoginBox />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerLayout: {
        flex: 1,
        flexDirection: 'row',
    },
    leftLayout: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightLayout: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 2
    },
    container: {
        backgroundColor: globalStyles.BLACK
    },
});

