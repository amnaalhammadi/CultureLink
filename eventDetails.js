import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Linking, ImageBackground, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import colors from "../assets/colors/colors";
import Feather from "react-native-vector-icons/Feather";
import Entypo from 'react-native-vector-icons/Entypo';
import { usePocketBase } from "../hooks/usePocketbase";

// Loading the font
Feather.loadFont();
Entypo.loadFont();

// Constants
const height = Dimensions.get("window").height;


const EventDetails = ({ route, navigation }) => {
    // Preparing the connection with the backend
    const { getCultureCategory } = usePocketBase();
    const [cultureCategory, setCultureCategory] = useState([]);

    // Fetching data
    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await getCultureCategory();
                console.log(result);
                setCultureCategory(result);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle the error (e.g., show an error message to the user)
            }
        };
        loadData();
    }, []);

    // Variables to store data
    const { item } = route.params;
    const [isLiked, setLiked] = useState(item.liked);

    const handleUpdateLike = async () => {
        try {
            // Update the like status in the backend
            await updateLike(item.id, { liked: !isLiked });
            // Update the local state to reflect the change
            setLiked(!isLiked);
        } catch (error) {
            console.error('Error updating like:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>

                {/* Header */}
                <ImageBackground
                    source={{ uri: item.backgImg }}
                    style={styles.BGimg}>
                    <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                        <View style={styles.backWrapper}>
                            <Entypo name='chevron-left' size={23} color={colors.activeIcon} />
                        </View>
                    </TouchableOpacity>
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
                            <Text style={styles.itemLabel}>Event Name</Text>
                            <Text style={styles.itemTitle}>{item.title}</Text>

                            <Text style={styles.itemLabel}>Date</Text>
                            <Text style={styles.itemDes}>{item.date}</Text>

                            <Text style={styles.itemLabel}>Location</Text>
                            <Text style={styles.itemDes}>{item.location}</Text>

                            <Text style={styles.itemLabel}>Description</Text>
                            <Text style={styles.itemDes}>{item.description}</Text>

                            <View style={styles.infoWrapper}>
                                <View style={styles.infoItem}>
                                    <Text style={styles.itemLabel}>Price</Text>
                                    <View style={styles.infoTextWrapper}>
                                        <Text style={styles.infoText}>{item.price}</Text>
                                        <Text style={styles.infoSubText}> /person</Text>
                                    </View>
                                </View>

                                <View style={styles.infoItem}>
                                    <Text style={styles.itemLabel}>Rating</Text>
                                    <View style={styles.infoTextWrapper}>
                                        <Text style={styles.infoText}>{item.rating}</Text>
                                        <Text style={styles.infoSubText}> /5</Text>
                                    </View>
                                </View>

                                <View style={styles.infoItem}>
                                    <Text style={styles.itemLabel}>Duration</Text>
                                    <View style={styles.infoTextWrapper}>
                                        <Text style={styles.infoText}>{item.duration}</Text>
                                        <Text style={styles.infoSubText}> /days</Text>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.buttonWrapper}
                                onPress={() => Linking.openURL(item.url)}>
                                <Text style={styles.buttonText}>More Info</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.buttonWrapper}
                                onPress={() => alert('The booking details will be sent by email!')}>
                                <Text style={styles.buttonText}>Book Now</Text>
                            </TouchableOpacity>
                        </View>
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
        backgroundColor: colors.background,
    },

    BGimg: {
        height: height * 0.3,
        width: 400
    },

    descriptionWrapper: {
        flex: 1,
        backgroundColor: colors.background,
        height: 120,
        marginTop: -20,
        borderRadius: 25,
        height: 700,
    },
    backIcon: {
        marginLeft: 26,
        marginTop: 30,
    },

    heartWrapper: {
        position: 'absolute', // full control of position
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

    contentWrapper: {
        marginTop: 35,
        marginLeft: 35,
        marginRight: 35,
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

    backWrapper: {
        position: 'absolute', // full control of position
        top: -5,
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

    infoWrapper: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
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


    buttonWrapper: {
        marginHorizontal: 10,
        marginTop: 25,
        backgroundColor: colors.textSubLight,
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

    buttonText: {
        fontSize: 18,
        color: colors.textLight,
    },
});

export default EventDetails;
