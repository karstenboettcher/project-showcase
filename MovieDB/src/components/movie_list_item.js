import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

export default class MovieListItem extends React.Component {
  styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      padding: 10,
      paddingLeft: 15,
    },
    movieInfo: {
      flex: 2,
    },
    movieTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    movieDescription: {
      fontSize: 14,
    },
    poster: {
      flex: 1,
      marginRight: 12,
    },
    posterImage: {
      width: 100,
      height: 100,
      backgroundColor: 'darkgrey',
    },
  });

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={this.styles.container}>
          <View style={this.styles.poster}>
            <Image
              style={this.styles.posterImage}
              source={{
                uri:
                  'http://image.tmdb.org/t/p/w185/' +
                  this.props.movie.poster_path,
              }}
            />
          </View>
          <View style={this.styles.movieInfo}>
            <Text style={this.styles.movieTitle}>{this.props.movie.title}</Text>
            <Text style={this.styles.movieDescription}>
              Released {this.props.movie.release_date}
            </Text>
            <Text style={this.styles.movieDescription}>
              Rating: {this.props.movie.vote_average}/10
            </Text>
            <Text numberOfLines={2} style={this.styles.movieDescription}>
              {this.props.movie.overview}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
