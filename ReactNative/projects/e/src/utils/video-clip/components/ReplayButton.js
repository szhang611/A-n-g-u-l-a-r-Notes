import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icons from 'react-native-vector-icons/MaterialIcons'

const backgroundColor = 'transparent';

const styles = StyleSheet.create({
    ReplayButton: {
        opacity: 0.9
    },
    replayContainer: {
        flex: 1,
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const ReplayButton = props => (
    <View style={styles.replayContainer}>
        <TouchableOpacity onPress={() => props.onPress()}>
            <Icons
                style={styles.ReplayButton}
                name={'replay'}
                color={props.theme}
                size={75}
            />
        </TouchableOpacity>
    </View>
);

ReplayButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
};

export { ReplayButton }
