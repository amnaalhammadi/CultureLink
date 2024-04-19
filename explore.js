import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, TextInput, SafeAreaView } from "react-native";
import colors from "../assets/colors/colors";
import Feather from "react-native-vector-icons/Feather";
import Entypo from 'react-native-vector-icons/Entypo';
import { FlatList } from "react-native-gesture-handler";
import { usePocketBase } from "../hooks/usePocketbase";
import { SliderBox } from "react-native-image-slider-box";
import { ScrollView } from 'react-native-virtualized-view';

// Loading the font
Feather.loadFont();
Entypo.loadFont();

const Explore = ({ navigation }) => {

    // Preparing the connection with the backend
    const { getPostData, getUserData } = usePocketBase();
    const [postData, setPostData] = useState([]);
    const [users, setUserData] = useState([]);
    const [filteredPost, setFilteredPost] = useState([]); // Initialize with all countries

    // Fetching data
    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await getPostData();
                console.log(result);

                const result1 = await getUserData();
                console.log(result1);

                setPostData(result);
                setUserData(result1);
                setFilteredPost(result); // Set filtered data initially to all data
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle the error (e.g., show an error message to the user)
            }
        };
        loadData();
    }, []);

    const renderPostItem = ({ item }) => {
        const user = users.find(users => users.id === item.usersID);
        const userPic = user ? { uri: user.profilePic } : '';
        const username = user ? user.username : '';

        return (
            <View>
                <View style={styles.descriptionWrapper}>
                    <TouchableOpacity onPress={() =>
                        navigation.navigate('DiscoverPost', { item: item })
                    }>
                        <View style={styles.userwrapper}>
                            <ImageBackground
                                source={userPic ? userPic : require('../assets/Images/default-profile-pic.png')}
                                style={styles.pic}
                                imageStyle={styles.imageStyle} />

                            <Text style={styles.username}>{username}</Text>
                        </View>

                        <Text style={styles.title}>{item.title}</Text>

                        <SliderBox
                            images={[item.image1, item.image2, item.image3].filter(uri => !!uri)} 
                            sliderBoxHeight={200}
                            dotColor={colors.ButtonBG1}
                            inactiveDotColor={colors.ButtonBG2}
                            style={styles.postStyle}
                        />

                    </TouchableOpacity>

                    <View style={styles.divider} />

                </View>

            </View>
        );
    };

    // Preparing the Search Query
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (text) => {
        setSearchQuery(text);
        setTimeout(() => {
            const filtered = postData.filter(post => post.title.toLowerCase().includes(text.toLowerCase()));
            setFilteredPost(filtered);
        }, 500); // Adjust delay as needed
    };

    // User Interface
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.headerWrapper}>

                    {/* Header */}
                    <SafeAreaView>
                        <View style={styles.menuWrapper}>

                            <Text style={styles.h1Title}>Explore</Text>

                            {/* Search Icon */}
                            <Feather name="search" size={23} color={colors.activeIcon} style={styles.searchIcon} />
                            {/* Search bar */}
                            <View style={styles.searchContainer}>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search post..."
                                    value={searchQuery}
                                    onChangeText={handleSearch} />
                            </View>
                        </View>
                    </SafeAreaView>

                    {/* List of Post */}
                    <View>
                        <FlatList
                            data={filteredPost}
                            renderItem={renderPostItem}
                            keyExtractor={(item) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            horizontal={false}
                        />
                    </View>
                </View>

            </ScrollView>
        </View>
    );
};

// Developing the Style Sheet
const styles = StyleSheet.create({

    container: {
        flex: 1,
        color: colors.textDark,
        backgroundColor: colors.background
    },

    searchContainer: {
        paddingHorizontal: 20, // Adjusted to a positive value
        paddingVertical: 10,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: colors.activeIcon,
        borderRadius: 8,
        marginRight: -25,
        padding: 6,
        width: 150
    },

    searchIcon: {
        marginHorizontal: 20,
        marginRight: -40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    pic: {
        height: 35,
        width: 35,
        marginTop: 10,
        marginLeft: 10
    },

    descriptionWrapper: {
        flex: 1,
        backgroundColor: colors.background,
        height: 200,
        marginLeft: 17,
        marginBottom: 20,
        borderRadius: 25,
        height: 220,
        width: 360,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },

    postStyle: {
        height: 115,
        width: 330,
        borderRadius: 10,
        marginLeft: 15
    },

    username: {
        fontSize: 12,
        fontWeight: 'light',
        color: colors.textDark,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 19
    },
    title: {
        fontSize: 12,
        color: colors.textDark,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15
    },

    userwrapper: {
        flexDirection: 'row',
        alignItems: 'left',
        marginTop: 5,
        marginLeft: 5
    },

    headerWrapper: {
        backgroundColor: colors.background,
        height: 2100,
        marginTop: -32,
        borderRadius: 25,
    },
    menuWrapper: {
        marginHorizontal: 30,
        marginVertical: 45,
        marginLeft: 30,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    h1Title: {
        fontSize: 23,
        marginRight: 30,
        color: colors.activeIcon,
    },

});

export default Explore;
