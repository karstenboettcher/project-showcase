import React from 'react';
import {View, StyleSheet} from 'react-native';
import SearchTabs from '../../navigators/search_tabs';

export default class SearchHub extends React.Component {
  styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  render() {
    return (
      <View style={this.styles.container}>
        <SearchTabs />
      </View>
    );
  }
}
