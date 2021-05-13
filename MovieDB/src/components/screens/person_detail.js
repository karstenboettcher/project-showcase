import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  ScrollView,
} from 'react-native';
import MoviesService from '../../services/movies.service';
import FeaturedListItem from '../featured_list_item';
import HeaderImage from '../header_image';

export default class PersonDetail extends React.Component {
  state = {
    person_id: this.props.route.params.detail_id,
    person_details: {},
    roles: [],
  };

  styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    personInfo: {
      padding: 12,
    },
    smallHeader: {
      fontWeight: 'bold',
      fontSize: 16,
      marginTop: 1,
    },
    sectionSpacer: {
      paddingBottom: 12,
    },
  });

  constructor(props) {
    super(props);
    this.getPersonDetailsFromQuery();
  }

  getPersonDetailsFromQuery = async () => {
    try {
      const person_details = await MoviesService.person(this.state.person_id);
      this.setState({person_details, roles: person_details.movie_credits.cast});
    } catch (e) {
      console.log(e);
    }
  };

  getDate = date => {
    return date == null ? 'N/A' : date;
  };

  render() {
    return (
      <ScrollView style={this.styles.container}>
        <HeaderImage
          title={this.state.person_details.name}
          header_image={this.state.person_details.profile_path}
        />
        <View style={this.styles.personInfo}>
          <View style={this.styles.sectionSpacer}>
            <Text style={{fontWeight: 'bold', fontSize: 16, paddingBottom: 4}}>
              About
            </Text>
            <Text>{this.state.person_details.biography}</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flex: 10}}>
              <Text style={this.styles.smallHeader}>Popularity</Text>
              <Text>{this.state.person_details.popularity}</Text>
            </View>
            <View style={{flex: 13}}>
              <Text style={this.styles.smallHeader}>Born</Text>
              <Text>{this.getDate(this.state.person_details.birthday)}</Text>
            </View>
            <View style={{flex: 11}}>
              <Text style={this.styles.smallHeader}>Died</Text>
              <Text>{this.getDate(this.state.person_details.deathday)}</Text>
            </View>
          </View>
          <View style={{marginTop: 16}}>
            <Text style={this.styles.smallHeader}>Starred In</Text>
            <FlatList
              style={{marginTop: 3}}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={this.state.roles}
              renderItem={itemData => {
                return (
                  <FeaturedListItem
                    picture={itemData.item.poster_path}
                    title={itemData.item.title}
                    character={itemData.item.character}
                  />
                );
              }}
              keyExtractor={role => `role_${role.id}`}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
