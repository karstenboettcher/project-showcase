import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchHub from '../screens/search/search_hub';
import MovieDetail from '../screens/movie_detail';
import PersonDetail from '../screens/person_detail';
const Stack = createStackNavigator();

export default class SearchNavigator extends React.Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Search" component={SearchHub} />
        <Stack.Screen name="Movie Details" component={MovieDetail} />
        <Stack.Screen name="Person Details" component={PersonDetail} />
      </Stack.Navigator>
    );
  }
}
