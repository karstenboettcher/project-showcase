import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import MoviesService from '../../../services/movies.service';
import MovieListItem from '../../movie_list_item';

export default class GenreSearch extends React.Component {
  state = {
    currentPage: 1,
    movies: [],
    loading: true,
    allLoaded: false,
    genre_id: this.props.route.params.genre_id,
  };

  styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    textInput: {
      margin: 16,
      borderBottomWidth: 1,
    },
  });

  constructor(props) {
    super(props);
    this.getMoviesFromSearchQuery();
  }

  getMoviesFromSearchQuery = async () => {
    try {
      const movies = await MoviesService.genre(this.state.genre_id, 1);
      this.setState({movies, loading: false, currentPage: 1});
    } catch (e) {
      console.log(e);
    }
  };

  loadMoreMovies = () => {
    if (this.state.loading) return;
    if (this.state.allLoaded) return;

    this.setState({loading: true}, async () => {
      try {
        const newMovies = await MoviesService.genre(
          this.state.genre_id,
          this.state.currentPage + 1,
        );
        this.setState(state => {
          const newState = {...state};
          newState.movies = [...state.movies, ...newMovies];
          newState.currentPage = state.currentPage + 1;
          newState.loading = false;
          if (newMovies.length === 0) {
            newState.allLoaded = true;
          }
          return newState;
        });
      } catch (e) {
        console.log(e);
      }
    });
  };

  render() {
    return (
      <View style={this.styles.container}>
        <FlatList
          data={this.state.movies}
          renderItem={dataEntry => {
            return (
              <MovieListItem
                movie={dataEntry.item}
                onPress={() => {
                  this.props.navigation.navigate('Movie Details', {
                    detail_id: dataEntry.item.id,
                  });
                }}
              />
            );
          }}
          onEndReached={this.loadMoreMovies}
          keyExtractor={movie => `movie_${movie.id}`}
        />
      </View>
    );
  }
}
