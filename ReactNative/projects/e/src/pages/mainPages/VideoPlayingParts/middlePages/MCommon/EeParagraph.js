import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet, View, Text
} from 'react-native';

const EeParagraph = ({style, children}) => (
    <Text
        style={[styles.paragraph, style]}>
        {children}
    </Text>
);

EeParagraph.propTypes = {

};

const styles = StyleSheet.create({
    paragraph:{
        color: 'white',
        fontSize: 12,
        paddingTop: 2,
        paddingBottom: 6,
        lineHeight: 14
    }
});

export default EeParagraph;