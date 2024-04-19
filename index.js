import React, { useState }  from "react";
import { StyleSheet} from "react-native";

import Home from "../Components/home";
import Details from "../Components/details";
import ListCountry from "../Components/listCountry";
import Profile from "../Components/profile";
import Explore from "../Components/explore";
import CateDetails from "../Components/cateDetails";
import LiveDetails from "../Components/liveDetails";
import ListLive from "../Components/listLive";
import EventDetails from "../Components/eventDetails";
import ListEvent from "../Components/listEvent";
import CultureCategoryDetails from "../Components/cultureCateDetails";
import Login from "../Components/login";
import ListCategory from "../Components/listCategory";
import DiscoverPost from "../Components/discoverPost";
import UserPage from "../Components/userPage";
import ServiceDetails from "../Components/serviceDetail";

import colors from "../assets/colors/colors";

// Import Icons
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
 
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

Entypo.loadFont();
MaterialCommunityIcons.loadFont();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = ({loggedInUsername}) => {

    // creating a container for each tab on the bottom
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: colors.activeIcon,
                tabBarInactiveTintColor: colors.inactiveIcon,
                tabBarShowLabel: false,
                headerShown: false,
                headerStyle: { backgroundColor: colors.headerBG },            
            }}
        >

            <Tab.Screen name="Home" component={Home}  options={{
                tabBarIcon: ({color}) => <Entypo name="home" size={29} color={color}/>,
            }}/>
            
            <Tab.Screen name="Explore" component={Explore} options={{
                tabBarIcon: ({color}) => <MaterialCommunityIcons name="grid" size={29} color={color}/>,
            }}/>

            <Tab.Screen name="Profile" options={{
                tabBarIcon: ({color}) => <MaterialCommunityIcons name="account" size={29} color={color}/>,
            }}>
                {(props) => <Profile {...props} loggedInUsername={loggedInUsername} />}
            </Tab.Screen>
            
        </Tab.Navigator>
    )
};


const App = () => {

    const [loggedInUsername, setLoggedInUsername] = useState(null);
    
    // Debagging 
    console.log("Logged In Username in App: ", loggedInUsername);

    return (
        <NavigationContainer independent={true} >
            <Stack.Navigator initialRouteName='Login'>
                
                <Stack.Screen name="Login" options={{ headerShown: false }}>
                    {props => (
                        <Login {...props} loggedInUsername={loggedInUsername} 
                        setLoggedInUsername={setLoggedInUsername} />
                    )}
                </Stack.Screen>

                <Stack.Screen
                    name="TabNavigator"
                    options={{ headerShown: false }}
                >
                    {props => (
                        <TabNavigator {...props} 
                        loggedInUsername={loggedInUsername} />
                    )}
                </Stack.Screen>

                <Stack.Screen name="Details" 
                component={Details}
                options={{headerShown: false}}/>

                <Stack.Screen name="CateDetails" 
                component={CateDetails}
                options={{headerShown: false}}/>

                <Stack.Screen name="Explore" 
                component={Explore}
                options={{headerShown: false}}/>

                <Stack.Screen name="ListCountry" 
                component={ListCountry}
                options={{headerShown: false}}/>

                <Stack.Screen name="LiveDetails" 
                component={LiveDetails}
                options={{headerShown: false}}/>

                <Stack.Screen name="ListLive" 
                component={ListLive}
                options={{headerShown: false}}/>

                <Stack.Screen name="EventDetails" 
                component={EventDetails}
                options={{headerShown: false}}/>

                <Stack.Screen name="ListEvent" 
                component={ListEvent}
                options={{headerShown: false}}/>

                <Stack.Screen name="ListCategory" 
                component={ListCategory}
                options={{headerShown: false}}/>

                <Stack.Screen name="CultureCategoryDetails" 
                component={CultureCategoryDetails}
                options={{headerShown: false}}/>

                <Stack.Screen name="DiscoverPost" 
                // component={DiscoverPost}
                options={{headerShown: false}}>
                    {props => (
                        <DiscoverPost {...props} 
                        loggedInUsername={loggedInUsername} />
                    )}
                </Stack.Screen>

                <Stack.Screen name="UserPage" 
                component={UserPage}
                options={{headerShown: false}}/>

                <Stack.Screen name="ServiceDetails" 
                component={ServiceDetails}
                options={{headerShown: false}}/>

            </Stack.Navigator>
        </NavigationContainer>
        
    );
    
};


const styles = StyleSheet.create ({
    tabBar: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderColor: colors.background,
    },
});

export default App;


