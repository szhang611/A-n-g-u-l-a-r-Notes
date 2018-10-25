import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet, View, Text, TouchableOpacity
} from 'react-native';
import * as globalStyles from '../../../../../styles/global';

const EeLink = ({ children, onPress }) => (
    <TouchableOpacity onPress={onPress} style={{ marginRight: 10 }}>
        <Text style={[styles.link]}>{children}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    link: {
        color: 'lightblue',
        textDecorationLine: 'underline',
        fontSize: 12,
    }
});

export default EeLink;