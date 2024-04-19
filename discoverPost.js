import React, { useEffect, useState } from "react";
import { Text, View, Alert, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import colors from "../assets/colors/colors";
import Feather from "react-native-vector-icons/Feather";
import Entypo from 'react-native-vector-icons/Entypo';
import { usePocketBase } from "../hooks/usePocketbase";
import { ScrollView } from 'react-native-virtualized-view';
import { SliderBox } from "react-native-image-slider-box";

// Load the font icons
Feather.loadFont();
Entypo.loadFont();


const DiscoverPost = ({ route, navigation, loggedInUsername }) => {
    const { getUserData, updateLike } = usePocketBase();
    const [users, setUserData] = useState([]);
    const [showAmbassador, setShowAmbassador] = useState(false);

    // Fetch user data on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const result1 = await getUserData();
                setUserData(result1);
                
                // Check if the logged-in user is an ambassador
                const isAmbassador = result1.some(user => user.username === loggedInUsername && user.ambassador === true);
                setShowAmbassador(isAmbassador);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle the error (e.g., show an error message to the user)
            }
        };
        loadData();
    }, []);

    // Extract item data from route params
    const { item } = route.params;

    // Find the user who posted the item
    const user = users.find(user => user.id === item.usersID);
    const userPic = user ? { uri: user.profilePic } : '';
    const username = user ? user.username : ''; 
    const [isLiked, setLiked] = useState(item.liked);

    // Handle updating the like status
    const handleUpdateLike = async () => {
        try {
            // Update the like status in the backend
            await updateLike(item.id, { liked: !isLiked });
            // Update the local state to reflect the change
            setLiked(prevIsLiked => !prevIsLiked);
        } catch (error) {
            console.error('Error updating like:', error);
        }
    };  

    // Handle reporting the post
    const handleReport = () => {
        Alert.alert(
            "Report Post",
            "Is there something wrong with the post? Do you want to report?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        console.log("Report confirmed");
                        Alert.alert("Report confirmed")
                    }
                },
                {
                    text: "No",
                    onPress: () => {
                        console.log("Report canceled");
                    }
                }
            ]
        );
    };

    return(
        <View style={styles.container}>
            <ScrollView>
                {/* Header */}
                <ImageBackground style={styles.background}>
                    <SliderBox
                        images={[item.image1, item.image2, item.image3].filter(uri => !!uri)}
                        sliderBoxHeight={200}
                        dotColor={colors.ButtonBG1}
                        inactiveDotColor={colors.ButtonBG2}
                        style={styles.BGimg}
                        dotStyle={styles.activeDot}
                        inactiveDotStyle={styles.inactiveDot}
                    />
                    <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                        <View style={styles.backWrapper}>
                            <Entypo name='chevron-left' size={23} color={colors.activeIcon}/>
                        </View>
                    </TouchableOpacity>

                    {showAmbassador && (
                        <TouchableOpacity style={styles.reportIcon} onPress={handleReport}>
                            <View style={styles.reportWrapper}>
                                <Feather name="more-horizontal" size={23} color={colors.activeIcon} style={styles.searchIcon} />
                            </View>
                        </TouchableOpacity>
                    )}
                    
                </ImageBackground>

                {/* Content */}
                <View style={styles.descriptionWrapper}>
                    <View style={styles.heartWrapper}>
                        <TouchableOpacity onPress={handleUpdateLike}>
                            <Entypo name={isLiked ? 'heart' : 'heart-outlined'} size={35} color={isLiked ? colors.heart : colors.grey} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentWrapper}>
                        <View key={item.id}>
                            <TouchableOpacity onPress={() => navigation.navigate('UserPage', { item: item })}>
                                <View style={styles.userwrapper}>
                                    <ImageBackground 
                                        source={userPic ? userPic : require('../assets/Images/default-profile-pic.png')}
                                        style={styles.pic}
                                        imageStyle={styles.imageStyle}
                                    />
                                    <Text style={styles.username}>{username}</Text>
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.itemLabel}>Post Title</Text>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemLabel}>Location</Text>
                            <Text style={styles.itemDes}>{item.location}</Text>
                            <Text style={styles.itemLabel}>Description</Text>
                            <Text style={styles.itemDes}>{item.description}</Text>
                            <View style={styles.infoItem}>
                                <Text style={styles.itemLabel}>Rating</Text>
                                <View style={styles.infoTextWrapper}>
                                    <Text style={styles.infoText}>{item.rating}</Text>
                                    <Text style={styles.infoSubText}> /5</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    BGimg: {
        height: 310,
        width: 400,
    },
    background: {
        height: 300,
        width: 400
    },
    descriptionWrapper: {
        flex: 1,
        backgroundColor: colors.background,
        height: 550,
        marginTop: -20,
        borderRadius: 25,
    },
    backIcon: {
        position: 'absolute',
        marginLeft: 26,
        marginTop: 30,
    },
    reportIcon: {
        position: 'absolute',
        marginLeft: 335,
        marginTop: 30,
    },
    heartWrapper: {
        position: 'absolute',
        right: 40,
        top: -20,
        width: 64,
        height: 64,
        backgroundColor: colors.background,
        borderRadius: 64,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    reportWrapper: {
        position: 'absolute',
        right: -30,
        top: 1,
        width: 35,
        height: 35,
        backgroundColor: colors.background,
        opacity: 0.7,
        borderRadius: 64,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    backWrapper: {
        position: 'absolute',
        right: -30,
        width: 35,
        height: 35,
        backgroundColor: colors.background,
        opacity: 0.7,
        borderRadius: 64,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    activeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginBottom: 15
    },
    inactiveDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginBottom: 15
    },
    pic: {
        height: 50,
        width: 50,
        marginTop: 10,
    },
    username: {
        fontSize: 14,
        fontWeight: 'light',
        color: colors.textDark,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 24
    },
    userwrapper: {
        flexDirection: 'row',
        alignItems: 'left',
    },
    contentWrapper: {
        marginTop: 35,
        marginLeft: 35,
        marginRight: 40,
    },
    itemLabel: {
        marginTop: 24,
        color: colors.textGrey,
        fontSize: 13,
        textTransform: 'uppercase',
    },
    itemTitle: {
        marginTop: 5,
        color: colors.textDark,
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    itemDes: {
        marginTop: 2,
        color: colors.textDark,
        fontSize: 15,
        lineHeight: 20,
        textAlign: "justify"
    },
    infoItem: {
        marginTop: 24,
    },
    infoTextWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 5,
    },
    infoText: {
        fontSize: 18,
        color: colors.textSubLight,
        fontWeight: 'bold',
    },
    infoSubText: {
        fontSize: 13,
        color: colors.textGrey,
        marginBottom: 2,
    },
});

export default DiscoverPost;
