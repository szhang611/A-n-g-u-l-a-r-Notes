'use strict';

import React from 'react';

import PropTypes from 'prop-types'
import ReactNative, {
  TextInput,
  View,
} from 'react-native';

import BaseComponent from './BaseComponent'
import styles from './styles'

class StatusBar extends BaseComponent {

    constructor(props) {
        super(props);

        this.inputText = '';
        this.state = {
            status: this.props.status
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            status: nextProps.status
        });
    }

    render() {
        return (
            <View style={styles.statusBar}>
                <TextInput
                    value={this.state.status}
                    style={styles.statusBarText}
                    editable={false}
                    numberOfLines={1}
                />

            </View>
        );
    }
}

StatusBar.propTypes = {
    status: PropTypes.string,
    foregroundColor: PropTypes.string
};

StatusBar.defaultProps = {
    status: '',
};

module.exports = StatusBar;
