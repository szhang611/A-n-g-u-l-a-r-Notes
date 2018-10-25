import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet, View, Text, TouchableOpacity
} from 'react-native';

const EeButton = ({style, children, onPress}) => (
    <TouchableOpacity onPress={onPress}>
        <View style={[styles.button, style]}>
            <Text style={[styles.txt]}>{children}</Text>
        </View>
    </TouchableOpacity>
);

EeButton.defaultProps = {
    onPress: () => {}
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    txt:{
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'blue',
        borderStyle: 'solid',
        fontSize: 14,
        color: 'white',
        backgroundColor: 'steelblue'
    }
});

export default EeButton;