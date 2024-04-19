import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, ImageBackground, Button } from "react-native";
import colors from "../assets/colors/colors";
import Feather from "react-native-vector-icons/Feather";
import Entypo from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import { usePocketBase } from "../hooks/usePocketbase";
import { ScrollView } from 'react-native-virtualized-view'
import { SliderBox } from "react-native-image-slider-box";
import verifylogo from "../assets/Images/verify.png";

// Loading the font
Feather.loadFont();
Entypo.loadFont();

const UserPage = ({route, navigation}) => {
    
    // Preparing the connection with the backend
    const { getPostData, getUserData } = usePocketBase();

    const [ postData, setPostData ] = useState([]);
    const [ users, setUserData ] = useState([]);
    const [ filteredPost, setFilteredPost ] = useState([]);
    const [ selectedOption, setSelectedOption ] = useState('Post');
    const [ verification, setVerification ] = useState([]);

    // Define state to manage which view to show
    const [ showPosts, setShowPosts ] = useState(true);
    const [ showAmbassador, setShowAmbassador ] = useState(false);

    
    const { item } = route.params;

    // Fetching data
    useEffect(() => {
        const loadData = async () => {
        const posts = await getPostData();
        const users = await getUserData();

        setPostData(posts);
        setUserData(users);

        const filteredPosts = posts.filter(post => {
                const user = users.find(user => user.id === item.usersID);
                return user && post.usersID === user.id;
            });
            setFilteredPost(filteredPosts);
        };

        setVerification(verification.filter(item => item.ambassador));

      loadData();
    }, []);

    const renderUserInfo = () => {
        const user = users.find(user => user.id === item.usersID);
        const userPic = user ? { uri: user.profilePic } : '';
        const username = user ? user.username : '';
        const name = user ? user.name : '';
        const nationality = user ? user.nationality : '';

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
                            <Text style={styles.h1}>Nationality:</Text>
                            <Text style={styles.h2}>{nationality}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };
    
    const isAmbassador = users.find(user => user.id === item.usersID && user.ambassador === true);

    const renderPostItem = ({ item }) => {
        const user = users.find(user => user.id === item.usersID);
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

    const renderVerification = () => {
        const user = users.find(user => user.id === item.usersID);
        const userPic = user ? { uri: user.profilePic } : '';
        const name = user ? user.name : '';
        const nationality = user ? user.nationality : '';
    
        return (
            <View>
                <View style={styles.verificationWrapper}>
                    <TouchableOpacity onPress={() =>
                        navigation.navigate('DiscoverPost', { item: item })
                    }>
                        <View style={styles.verification}>
                            <ImageBackground 
                                    source={userPic ? userPic : require('../assets/Images/default-profile-pic.png')}
                                    style={styles.picVeri}
                                    imageStyle={styles.imageStyle}/>

                            <ImageBackground 
                                source={verifylogo} 
                                style={styles.verifylogo}/>

                            <Text style={styles.verifyName}>{name}</Text>

                            <Text style={styles.verifyText}>is verified as a {nationality} Culture Ambassador</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // Function to toggle between option
    const handleShowPosts = () => {
        setShowPosts(true);
        setShowAmbassador(false);
        setSelectedOption('Post');
    };
    const handleShowAmbassador = () => {
        setShowPosts(false);
        setShowAmbassador(true);
        setSelectedOption('Ambassador');
    };
    
    // User Interface
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.headerWrapper}>

                    {/* Header */}
                    <SafeAreaView>
                        <View style={styles.menuWrapper}>
                            <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                                <Entypo name='chevron-left' size={23} color={colors.textDark}/>
                            </TouchableOpacity>

                            <Text style={styles.h1Title}>User Details</Text>
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

                        {isAmbassador && (
                            <Button
                                title="Ambassador"
                                onPress={handleShowAmbassador}
                                color={selectedOption === 'Ambassador' ? colors.activeIcon : colors.inactiveIcon} // Change color based on selection
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

                    {showAmbassador && renderVerification ()}


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
        // marginBottom: -20,
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

    verifylogo:{
        height: 25,
        width: 25,
        marginLeft: 60,
        marginBottom: 10
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

    picVeri:{
        height: 65,
        width: 65,
        // marginLeft: 140,
        marginTop: 30,
        marginBottom: -20,
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

    verificationWrapper:{
        // flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        height: 200,
        marginLeft: 17,
        marginBottom: 20,
        marginTop: 20,
        borderRadius: 25,
        height: 210,
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

    verification:{
        // flex: 1,
        alignItems: 'center',
        height: 200,
        // marginLeft: 17,
        // marginBottom: 20,
        marginTop: -10,
        justifyContent: 'center',
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
        // marginTop: 10,
    },

    noPost:{
        fontWeight: 'light',
        color: colors.textGrey,
        textTransform: 'uppercase',
        marginTop: 50,
        marginLeft: 123,
    },

    backIcon: {
        position: 'absolute',
        marginLeft: 5,
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

    verifyName:{
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.textDark,
        // marginLeft: 125,
        marginBottom: 10,
        textTransform: 'uppercase',
        justifyContent: 'center',
    },

    verifyText:{ 
        fontSize: 15,
        fontWeight: 'light',
        color: colors.textDark,
        // marginLeft: 44,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',

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
        marginBottom: -25,
        flexDirection: 'row',
        // justifyContent: 'space-between',
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
        marginLeft: 115,
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

export default UserPage;