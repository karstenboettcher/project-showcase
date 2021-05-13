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

export default class MovieDetail extends React.Component {
  state = {
    movie_id: this.props.route.params.detail_id,
    movie_details: {},
    cast: [],
  };

  styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    movieInfo: {
      padding: 12,
    },
    smallHeader: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    sectionSpacer: {
      paddingBottom: 12,
    },
  });

  constructor(props) {
    super(props);
    this.getMovieDetailsFromQuery();
  }

  getMovieDetailsFromQuery = async () => {
    try {
      const movie_details = await MoviesService.movie(this.state.movie_id);
      this.setState({movie_details, cast: movie_details.credits.cast});
    } catch (e) {
      console.log(e);
    }
  };

  getGenres = () => {
    let genre_string = '';
    for (const genre in this.state.movie_details.genres) {
      if (genre != this.state.movie_details.genres.length - 1) {
        genre_string = genre_string.concat(
          `${this.state.movie_details.genres[genre].name}, `,
        );
      } else {
        genre_string = genre_string.concat(
          `${this.state.movie_details.genres[genre].name}`,
        );
      }
    }
    return genre_string;
  };

  render() {
    return (
      <ScrollView style={this.styles.container}>
        <HeaderImage
          title={this.state.movie_details.title}
          header_image={this.state.movie_details.backdrop_path}
        />
        <View style={this.styles.movieInfo}>
          <View style={this.styles.sectionSpacer}>
            <Text style={{fontWeight: 'bold', fontSize: 16, paddingBottom: 4}}>
              Overview
            </Text>
            <Text>{this.state.movie_details.overview}</Text>
          </View>

          <View style={this.styles.sectionSpacer}>
            <Text style={this.styles.smallHeader}>Genres</Text>
            <Text>{this.getGenres()}</Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flex: 10}}>
              <Text style={this.styles.smallHeader}>Rating</Text>
              <Text>{this.state.movie_details.vote_average}/10</Text>
            </View>
            <View style={{flex: 12}}>
              <Text style={this.styles.smallHeader}>Released</Text>
              <Text>{this.state.movie_details.release_date}</Text>
            </View>
            <View style={{flex: 13}}>
              <Text style={this.styles.smallHeader}>Budget</Text>
              <Text>${this.state.movie_details.budget}</Text>
            </View>
            <View style={{flex: 11}}>
              <Text style={this.styles.smallHeader}>Revenue</Text>
              <Text>${this.state.movie_details.revenue}</Text>
            </View>
          </View>
          <View style={{marginTop: 16}}>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 3}}>
              Cast
            </Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={this.state.cast}
              renderItem={itemData => {
                return (
                  <FeaturedListItem
                    picture={itemData.item.profile_path}
                    title={itemData.item.name}
                    character={itemData.item.character}
                  />
                );
              }}
              keyExtractor={cast => `cast_${cast.id}`}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
