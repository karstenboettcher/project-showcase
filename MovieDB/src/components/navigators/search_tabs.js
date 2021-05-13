import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Search from '../screens/search/search';
const Tab = createMaterialTopTabNavigator();

export default class SearchTabs extends React.Component {
  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Movies" component={Search} initialParams={{ pathID: 0 }}/>
        <Tab.Screen name="People" component={Search} initialParams={{ pathID: 1 }}/>
      </Tab.Navigator>
    );
  }
}
