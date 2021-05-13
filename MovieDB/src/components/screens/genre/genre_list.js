import React from 'react';
import {FlatList} from 'react-native';
import {Container, Text, ListItem} from 'native-base';
import MoviesService from '../../../services/movies.service';

export default class GenreList extends React.Component {
  state = {
    genres: [],
  };

  constructor() {
    super();
    this.getGenresFromQuery();
  }

  getGenresFromQuery = async () => {
    try {
      const genres = await MoviesService.getGenres();
      this.setState({genres});
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <Container>
        <FlatList
          data={this.state.genres}
          renderItem={itemData => {
            return (
              <ListItem
                button
                onPress={() => {
                  this.props.navigation.navigate('GenreSearch', {
                    genre_name: itemData.item.name,
                    genre_id: itemData.item.id,
                  });
                }}>
                <Text>{itemData.item.name}</Text>
              </ListItem>
            );
          }}
          keyExtractor={genre => `genre_${genre.id}`}
        />
      </Container>
    );
  }
}
