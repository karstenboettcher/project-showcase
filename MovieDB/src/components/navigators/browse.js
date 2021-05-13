import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import GenreList from '../screens/genre/genre_list';
import GenreSearch from '../screens/genre/genre_search';
import MovieDetail from '../screens/movie_detail';
const Stack = createStackNavigator();

export default class BrowseNavigator extends React.Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Browse" component={GenreList} />
        <Stack.Screen
          name="GenreSearch"
          component={GenreSearch}
          options={({route}) => ({title: route.params.genre_name})}
        />
        <Stack.Screen name="Movie Details" component={MovieDetail} />
      </Stack.Navigator>
    );
  }
}
