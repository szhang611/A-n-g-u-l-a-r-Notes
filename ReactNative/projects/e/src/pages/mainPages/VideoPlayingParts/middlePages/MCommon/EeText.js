import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet, View, Text
} from 'react-native';
import * as globalStyles from '../../../../../styles/global';

const EeText = ({children, style}) => (
    <Text style={[styles.text, style]}>{children}</Text>
);

EeText.propTypes = {

};

const styles = StyleSheet.create({
    text: {
        color: 'white',
        fontSize: 12,
    }
});

export default EeText;