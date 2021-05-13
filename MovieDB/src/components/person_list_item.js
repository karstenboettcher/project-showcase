import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

export default class PersonListItem extends React.Component {
  styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      padding: 10,
      paddingLeft: 15,
    },
    personInfo: {
      flex: 2,
    },
    personName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    personPopularity: {
      fontSize: 14,
    },
    headshotContainer: {
      flex: 1,
      marginRight: 12,
    },
    headshot: {
      width: 100,
      height: 100,
      backgroundColor: 'darkgrey',
    },
  });

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={this.styles.container}>
          <View style={this.styles.headshotContainer}>
            <Image
              style={this.styles.headshot}
              source={{
                uri:
                  'http://image.tmdb.org/t/p/w185/' +
                  this.props.person.profile_path,
              }}
            />
          </View>
          <View style={this.styles.personInfo}>
            <Text style={this.styles.personName}>{this.props.person.name}</Text>
            <Text style={this.styles.personPopularity}>
              Popularity: {this.props.person.popularity}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
