import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BrowseNavigator from './src/components/navigators/browse';
import SearchNavigator from './src/components/navigators/search';
const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Browse" component={BrowseNavigator} />
          <Tab.Screen name="Search" component={SearchNavigator} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
