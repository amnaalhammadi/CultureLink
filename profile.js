import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert, ImageBackground, Button } from "react-native";
import colors from "../assets/colors/colors";
import Feather from "react-native-vector-icons/Feather";
import Entypo from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import { usePocketBase } from "../hooks/usePocketbase";
import { ScrollView } from 'react-native-virtualized-view'
import { SliderBox } from "react-native-image-slider-box";

// Loading the font
Feather.loadFont();
Entypo.loadFont();

const Profile = ({navigation, loggedInUsername}) => {
    
    // Preparing the connection with the backend
    const { getPostData, getUserData, getService } = usePocketBase();
    
    const [ postData, setPostData ] = useState([]);
    const [ users, setUserData ] = useState([]);
    const [ filteredPost, setFilteredPost ] = useState([]);
    const [ service, setService ] = useState([]);
    
    const [ filteredUserService, setFilteredUserService ] = useState([]);
    const [ filteredAmbassadorService, setFilteredAmbassadorService ] = useState([]);
    const [selectedOption, setSelectedOption] = useState('Post');

    // Define state to manage which view to show
    const [showPosts, setShowPosts] = useState(true);
    const [showAmbassador, setShowAmbassador] = useState(false);
    const [showServices, setShowServices] = useState(false);

    const isAmbassador = users.find(user => user.username === loggedInUsername && user.ambassador === true);

    // Fetching data
    useEffect(() => {
        const loadData = async () => {
        const posts = await getPostData();
        const users = await getUserData();
        const service = await getService();

        console.log("Logged in username inside useEffect:", loggedInUsername); // Add this line

        setPostData(posts);
        setUserData(users);
        setService(service);

        // Filter posts by logged in user's username
        const filteredPosts = posts.filter(post => {
            const user = users.find(users => users.username === loggedInUsername);
            return user && post.usersID === user.id;
        });

        setFilteredPost(filteredPosts);
        setFilteredUserService(service.filter(item => item.userService)); // Filter most viewed cultures
        setFilteredAmbassadorService(service.filter(item => !item.userService)); // Filter most viewed cultures

      };
      loadData();
    }, [loggedInUsername]);

    console.log("Logged in username:", loggedInUsername);

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => navigation.navigate("Login") }
            ]
        );
    };
    
    const renderUserInfo = () => {
        const user = users.find(user => user.username === loggedInUsername);
        const userPic = user ? { uri: user.profilePic } : '';
        const username = user ? user.username : '';
        const name = user ? user.name : '';
        const nationality = user ? user.nationality : '';
        const phone_num = user ? user.phone_num : '';
        const email = user ? user.email : '';

        return (
            <View>
                <View style={styles.userwrapper}>
                    <View>
                        <ImageBackground
                            source={userPic ? userPic : require('../assets/Images/default-profile-pic.png')}
                            style={styles.profilePic}
                            imageStyle={styles.imageStyle} />
                    </View>

                    <View>
                        <View style={styles.infoWrapper}>
                            <Text style={styles.h1}>Name:</Text>
                            <Text style={styles.h2}>{name}</Text>
                        </View>
                        <View style={styles.infoWrapper}>
                            <Text style={styles.h1}>Username:</Text>
                            <Text style={styles.h2}>{username}</Text>
                        </View>
                        <View style={styles.infoWrapper}>
                            <Text style={styles.h1}>Email:</Text>
                            <Text style={styles.h2}>{email}</Text>
                        </View>
                        <View style={styles.infoWrapper}>
                            <Text style={styles.h1}>Nationality:</Text>
                            <Text style={styles.h2}>{nationality}</Text>
                        </View>
                        <View style={styles.infoWrapper}>
                            <Text style={styles.h1}>Phone Number:</Text>
                            <Text style={styles.h2}>{phone_num}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

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
                        <View style={styles.postwrapper}>
                            <ImageBackground 
                                source={userPic ? userPic : require('../assets/Images/default-profile-pic.png')}
                                style={styles.pic}
                                imageStyle={styles.imageStyle}/>
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
                </View>
            </View>
        );
    };
    
    const renderServiceItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('ServiceDetails', { item: item })}
            >
                <ImageBackground
                    source={{ uri: item.img }}
                    style={styles.discoverService}
                    imageStyle={styles.countryImg}
                />
            </TouchableOpacity>
        );
    };
    
    // Function to toggle between showing posts and showing ambassador
    const handleShowPosts = () => {
        setShowPosts(true);
        setShowAmbassador(false);
        setShowServices(false);
        setSelectedOption('Post');
    };
    
    const handleShowAmbassador = () => {
        setShowPosts(false);
        setShowAmbassador(true);
        setShowServices(false);
        setSelectedOption('Ambassadors');
    };
    
    const handleShowServices = () => {
        setShowPosts(false);
        setShowAmbassador(false);
        setShowServices(true);
        setSelectedOption('Services');
    };
    
    // User Interface
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.headerWrapper}>

                    {/* Header */}
                    <SafeAreaView>
                        <View style={styles.menuWrapper}>
                            <Text style={styles.h1Title}>Profile Page</Text>

                            <TouchableOpacity onPress={handleLogout}>
                                <Text style={styles.logout}>Logout</Text>
                            </TouchableOpacity>
                        </View>

                    </SafeAreaView>

                    {/* check to render it only if there are posts available */}
                    {renderUserInfo()}

                    {/* Toggle buttons */}
                    <View style={styles.options}>
                        <Button
                            title="Post"
                            onPress={handleShowPosts}
                            color={selectedOption === 'Post' ? colors.activeIcon : colors.inactiveIcon} // Change color based on selection
                        />

                        <Button
                            title="Services"
                            onPress={handleShowServices}
                            color={selectedOption === 'Services' ? colors.activeIcon : colors.inactiveIcon} // Change color based on selection
                        />

                        {isAmbassador && (
                            <Button
                                title="Ambassadors"
                                onPress={handleShowAmbassador}
                                color={selectedOption === 'Ambassadors' ? colors.activeIcon : colors.inactiveIcon} // Change color based on selection
                            />
                        )}
                    </View>

                    {/* Render posts or ambassador section based on state */}
                    {showPosts && (
                        <View>
                            {filteredPost.length > 0 ? (
                                <View style={styles.sharedPost}>
                                    <FlatList
                                        data={filteredPost}
                                        renderItem={renderPostItem}
                                        keyExtractor={(item) => item.id.toString()}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            ) : (
                                <Text style={styles.noPost}>No Available Posts</Text>
                            )}
                        </View>
                    )}

                    {showServices && (
                        <View>
                            <View style={styles.sharedPost}>
                                <FlatList
                                    data={filteredUserService}
                                    renderItem={renderServiceItem}
                                    keyExtractor={(item) => item.id.toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </View>
                    )}

                    {showAmbassador && (
                        <View>
                            <View style={styles.sharedPost}>
                                <FlatList
                                    data={filteredAmbassadorService}
                                    renderItem={renderServiceItem}
                                    keyExtractor={(item) => item.id.toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </View>
                    )}


                </View>

            </ScrollView>
        </View>
    );
};


// Developing the Style Sheet
const styles = StyleSheet.create ({

    // HEADER SECTION
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
        padding: 6,
        width: 150
    },

    options: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginBottom: -10,
    },

    searchIcon: {
        marginHorizontal: 20,
        marginRight: -40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    sharedPost:{
        marginTop:20,
    },

    postWrapper: {
        // backgroundColor: colors.ButtonBG1,
        height: 220,
        width: 340,
        marginTop: 15,
        paddingVertical: 20,
        borderRadius: 25,
        marginLeft: 25,
        marginBottom:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
    },

    pic: {
        height: 35,
        width: 35,
        marginTop: 10,
        marginLeft: 10,
    },

    discoverService:{
        width: 330,
        height: 75,
        marginLeft: 25,
        justifyContent: 'flex-end',
        margin: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.055,
          shadowRadius: 3.84,
          elevation: 5,
    },

    profilePic:{
        height: 90,
        width: 90,
        marginTop: 10,
        marginLeft: 150,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
    },

    descriptionWrapper: {
        flex: 1,
        backgroundColor: colors.background,
        height: 200,
        marginLeft: 17,
        // marginTop: -10,
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

    postStyle:{
        height: 115,
        width: 330,
        borderRadius: 10,
        marginLeft: 15
        // marginBottom: 90,
    },
    
    username: {
        // fontFamily: 'Leto',
        fontSize: 12,
        fontWeight: 'light',
        color: colors.textDark,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 19
    },

    logout:{
        fontWeight: 'light',
        color: colors.textDark,
        textTransform: 'uppercase',
        marginTop: 10,
    },

    noPost:{
        fontWeight: 'light',
        color: colors.textGrey,
        textTransform: 'uppercase',
        marginTop: 50,
        marginLeft: 123,
    },

    h1: {
        // fontFamily: 'Leto',
        fontSize: 15,
        textTransform: 'uppercase',
        fontWeight: 'light',
        color: colors.textGrey,
        marginLeft: 15,
        marginRight: 10,
        marginBottom: -15,
    },

    h2: {
        // fontFamily: 'Leto',
        fontSize: 15,
        fontWeight: 'light',
        color: colors.textDark,
        marginRight: 15,
        textTransform: 'uppercase',
    },

    h3: {
        // fontFamily: 'Leto',
        fontSize: 15,
        fontWeight: 'light',
        color: colors.textDark,
        marginRight: 15,
        textTransform: 'uppercase',
    },

    infoWrapper: {
        flexDirection: 'row',
        // marginHorizontal: 20,
        marginTop: 20,
        // justifyContent: 'space-between',
    },

    title: {
        // fontFamily: 'Leto',
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textDark,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15
    },
    para: {
        // fontFamily: 'Leto',
        fontSize: 10,
        color: colors.textDark,
        marginTop: 4,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 10
    },

    postwrapper:{
        flexDirection: 'row',
        alignItems: 'left',
        marginTop: 5,
        marginLeft: 5
    },

    userwrapper:{
        alignItems: 'left',
        marginTop: 5,
        marginLeft: 5,
        marginBottom: 20,
    },

    headerWrapper: {
        backgroundColor: colors.background,
        height: 1000,
        marginTop: -32,
        borderRadius: 25,
    },
    menuWrapper: {
        marginHorizontal: 30,
        marginVertical: 10,
        marginLeft: 20,
        marginBottom: -10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    // MOST VIEWED SECTION 
    mostViewed_Wapper: {
        marginHorizontal: 20,
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    h1Title: {
        // fontFamily: 'Leto',
        fontSize: 23,
        color: colors.textDark,
        
    },
    
    seeAll: {
        // fontFamily: 'Roboto-Bold',
        fontSize: 14,
        color: '#92A1B2',
    },
    dicoverCountry: {
        width: 205,
        height: 270,
        justifyContent: 'flex-end',
        marginRight: -11,
        marginLeft: 13,
        marginTop: 12,
    },
    countryTitle: {
        // fontFamily: 'Roboto-Bold',
        fontSize: 18,
        color: colors.textDark,
        marginLeft: 20,
    },
    locationWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 65,
        marginRight: 40,
        marginLeft: 15,
        marginTop: 5
    },
    
    locationTitle: {
        // fontFamily: 'Roboto-Bold',
        fontSize: 13,
        color: colors.locationBG,
        textAlign: 'left',
        
    },



});

export default Profile;