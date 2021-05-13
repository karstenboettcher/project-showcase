import React from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';

export default class HeaderImage extends React.Component {
  styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headerContainer: {
      width: '100%',
      height: 150,
      backgroundColor: 'black',
    },
    headerImage: {
      width: '100%',
      height: 150,
      justifyContent: 'center',
    },
    headerText: {
      padding: 12,
      color: 'white',
      fontSize: 28,
      textAlign: 'center',
    },
    movieInfo: {
      padding: 12,
    },
  });

  render() {
    return (
      <View style={this.styles.headerContainer}>
        <ImageBackground
          style={this.styles.headerImage}
          imageStyle={{opacity: 0.45}}
          source={{
            uri: 'http://image.tmdb.org/t/p/w780/' + this.props.header_image,
          }}>
          <Text numberOfLines={2} style={this.styles.headerText}>
            {this.props.title}
          </Text>
        </ImageBackground>
      </View>
    );
  }
}
