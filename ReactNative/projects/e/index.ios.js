import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button, ScrollView
} from 'react-native';

import {Provider} from 'react-redux';

import createStore from './src/createStore';
import AppContainer from './src/App';


const store = createStore();
export default class EEDemo extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}


AppRegistry.registerComponent('EEDemo', () => EEDemo);
