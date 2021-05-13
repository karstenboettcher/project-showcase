import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

export default class FeaturedListItem extends React.Component {
  styles = StyleSheet.create({
    container: {
      flex: 1,
      width: 110,
      marginRight: 16,
    },
    title: {
      fontWeight: 'bold',
    },
    picture: {
      width: 110,
      height: 110,
      backgroundColor: 'darkgrey',
    },
  });

  render() {
    return (
      <View style={this.styles.container}>
        <Image
          style={this.styles.picture}
          source={{
            uri: 'http://image.tmdb.org/t/p/w185/' + this.props.picture,
          }}
        />
        <Text style={this.styles.title}>{this.props.title}</Text>
        <Text style={{paddingBottom: 60}}>{this.props.character}</Text>
      </View>
    );
  }
}
