import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import * as globalStyles from '../../styles/global';

const Logo = ({ style, children, ...rest }) => (
    <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo/logo_login.png')} resizeMode='stretch' s/>
    </View>
);

const styles = StyleSheet.create({
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        height: '40%',
        width: '40%'
    }
});

export default Logo;