import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet, View, Text
} from 'react-native';

const EeBreak = ({style}) => (
    <View style={[styles.break, style]}></View>
);

EeBreak.propTypes = {

};

const styles = StyleSheet.create({
    break: {
        height: 20
    }
});

export default EeBreak;