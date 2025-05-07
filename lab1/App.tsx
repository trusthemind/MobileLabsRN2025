import { NavigationContainer } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import HomeScreen from './screens/HomeScreen'
import GalleryScreen from './screens/GalleryScreen'
import ProfileScreen from './screens/ProfileScreen'
import { View } from 'react-native'
import Header from './components/Header'
import { FontAwesome } from '@expo/vector-icons'
import Footer from './components/Footer'

const Tab = createMaterialTopTabNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <View style={{ flex: 1 }}>
                <Header />
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ color }) => {
                            let iconName: 'home' | 'image' | 'user' = 'home'

                            if (route.name === 'Home') iconName = 'home'
                            if (route.name === 'Gallery') iconName = 'image'
                            if (route.name === 'Profile') iconName = 'user'

                            return <FontAwesome name={iconName} size={20} color={color} />
                        },
                        tabBarActiveTintColor: 'blue',
                        tabBarInactiveTintColor: 'gray',
                        tabBarIndicatorStyle: {
                            backgroundColor: 'transparent',
                            height: 0
                        }
                    })}
                >
                    <Tab.Screen name='Home' component={HomeScreen} />
                    <Tab.Screen name='Gallery' component={GalleryScreen} />
                    <Tab.Screen name='Profile' component={ProfileScreen} />
                </Tab.Navigator>
                <Footer />
            </View>
        </NavigationContainer>
    )
}
