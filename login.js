import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import colors from "../assets/colors/colors";
import logo from "../assets/Images/logo.png";
import Feather from "react-native-vector-icons/Feather";
import Entypo from 'react-native-vector-icons/Entypo';
import { usePocketBase } from "../hooks/usePocketbase";

// Loading the font
Feather.loadFont();
Entypo.loadFont();

const Login = ({ navigation, setLoggedInUsername }) => {
    const { getUserData } = usePocketBase();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const result = await getUserData();
            setUsers(result);
        };
        loadData();
    }, []);

    const handleLogin = () => {
        const user = users.find(user => user.username === username); // Find the user by username
        if (user && user.password === password) {
            alert('Login successful');

            navigation.navigate('TabNavigator'); // You don't need this line since you're already navigating in the App component
            setLoggedInUsername(user.username); // Update the logged-in username
        
        } else {
            alert('Invalid username or password. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground 
                source={logo} 
                style={styles.BGimg}/>

            <View style={styles.buttonWrapper}>

                <View style={styles.loginWrapper}>
                    <Text style={styles.title}>Username:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Username"
                        onChangeText={setUsername}
                        value={username}
                        autoCapitalize="none"
                    />
                    <Text style={styles.title}>Password:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Password"
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry
                    />
                    
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Signup</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </View>
    );
};

// Style Sheet
const styles = StyleSheet.create({

    input: {
        width: '80%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        borderRadius: 10,
        width: 250,
        height: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
    },
    BGimg: {
        height: 200,
        width: 250,
        marginTop: 100,
        marginLeft: 70,
        marginVertical: -90,
        marginBottom: -10,
    },
    button: {
        width: '80%',
        padding: 15,
        width: 250,
        marginTop: 15,
        backgroundColor: colors.textDark,
        borderRadius: 5,
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
    },
    title:{
        padding: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    container: {
        flex: 1,
        backgroundColor: colors.textDark,
    },
    loginWrapper:{
        marginHorizontal: 15,
        marginLeft: 35,
        marginRight: 35,
        alignItems: 'center',
        paddingVertical: 15,
    },
    buttonWrapper: {
        marginHorizontal: 15,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        backgroundColor: colors.background,
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
    },

});

export default Login;
