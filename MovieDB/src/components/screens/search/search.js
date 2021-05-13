import React from 'react';
import _ from 'lodash';
import {View, FlatList, StyleSheet, TextInput} from 'react-native';
import MoviesService from '../../../services/movies.service';
import MovieListItem from '../../movie_list_item';
import PersonListItem from '../../person_list_item';

export default class Search extends React.Component {
  state = {
    currentPage: 1,
    data: [],
    loading: true,
    allLoaded: false,
    searchTerm: '',
    pathID: this.props.route.params.pathID,
  };

  styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    textInput: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderBottomWidth: 1,
    },
  });

  constructor(props) {
    super(props);
    this.getDataFromSearchQuery = _.debounce(this.getDataFromSearchQuery, 1000);
  }

  getSearchType = () => {
    return this.state.pathID == 0 ? 'movie' : 'person';
  };

  getDataFromSearchQuery = async () => {
    let searchType = this.getSearchType();

    try {
      const data = await MoviesService.search(
        this.state.searchTerm,
        1,
        searchType,
      );
      this.setState({data, loading: false, currentPage: 1});
    } catch (e) {
      console.log(e);
    }
  };

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.searchTerm === this.state.searchTerm) return;
    this.getDataFromSearchQuery();
  }

  loadMoreData = () => {
    if (this.state.loading) return;
    if (this.state.allLoaded) return;
    let searchType = this.getSearchType();

    this.setState({loading: true}, async () => {
      try {
        const newData = await MoviesService.search(
          this.state.searchTerm,
          this.state.currentPage + 1,
          searchType,
        );
        this.setState(state => {
          const newState = {...state};
          newState.data = [...state.data, ...newData];
          newState.currentPage = state.currentPage + 1;
          newState.loading = false;
          if (newData.length === 0) {
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
        <TextInput
          value={this.state.searchTerm}
          style={this.styles.textInput}
          onChangeText={newText =>
            this.setState({searchTerm: newText, data: []})
          }
        />
        <FlatList
          data={this.state.data}
          renderItem={itemData => {
            if (this.state.pathID == 0) {
              return (
                <MovieListItem
                  movie={itemData.item}
                  onPress={() => {
                    this.props.navigation.navigate('Movie Details', {
                      detail_id: itemData.item.id,
                    });
                  }}
                />
              );
            } else {
              return (
                <PersonListItem
                  person={itemData.item}
                  onPress={() => {
                    this.props.navigation.navigate('Person Details', {
                      detail_id: itemData.item.id,
                    });
                  }}
                />
              );
            }
          }}
          onEndReached={this.loadMoreData}
          keyExtractor={item => `item_${item.id}`}
        />
      </View>
    );
  }
}
