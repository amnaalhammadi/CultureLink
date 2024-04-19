import React , { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Image, ImageBackground, Dimensions, TouchableOpacity} from "react-native";
import colors from "../assets/colors/colors";
import { ScrollView } from 'react-native-virtualized-view'

// Import Icon
import Feather from "react-native-vector-icons/Feather";
import Entypo from 'react-native-vector-icons/Entypo';
import { usePocketBase } from "../hooks/usePocketbase";

// loading the font
Feather.loadFont();
Entypo.loadFont();

const height = Dimensions.get("window").height;

const LiveDetails = ({route, navigation}) => {

    // Preparing the connection with the backend
    const { getLiveData, updateLike } = usePocketBase();
    const [liveData, setLiveData] = useState([]);

    // Fetching data
    useEffect(() => {
        const loadData = async() => {
            const result = await getLiveData()
            console.log(result)

            setLiveData(result)
        }
        loadData()
    }, [])

    // variables to store data
    const {item} = route.params;
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
    

    return(
        <View style={styles.container}>
            <ScrollView>

                {/* header */}
                <ImageBackground 
                    source={{ uri: item.backgImg }} 
                    style={styles.BGimg}>
                    <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                        <View style={styles.backWrapper}>
                            <Entypo name='chevron-left' size={23} color={colors.activeIcon}/>
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

                            <Text style={styles.itemLabel}>Live Name</Text>
                            <Text style={styles.itemTitle}>{item.title}</Text>


                            {/*  only be rendered if item.liveNow is true */}
                            {item.liveNow && (
                            <>
                                <View style={styles.infoWrapper}>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.itemLabel}>Date</Text>
                                        <View style={styles.infoTextWrapper}>
                                            <Text style={styles.itemDes}>{item.date}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.infoItem}>
                                        <Text style={styles.itemLabel}>Time</Text>
                                        <View style={styles.infoTextWrapper}>
                                            <Text style={styles.itemDes}>{item.time}</Text>
                                        </View>
                                    </View>
                                </View>

                                <Text style={styles.itemLabel}>Description</Text>
                                <Text style={styles.itemDes}>{item.description}</Text>

                                <View style={styles.infoWrapper}>
                                <View style={styles.infoItem}>
                                    <Text style={styles.itemLabel}>speakers</Text>
                                    <View style={styles.infoTextWrapper}>
                                        <Image source={{ uri: item.speaker_pic }} style={styles.speakerImage} />
                                        <Text style={styles.speakerName}>{item.speaker}</Text>
                                    </View>
                                </View>
                            </View>
                            </>
                        )}

                            <TouchableOpacity
                                style={styles.buttonWrapper} 
                                onPress={() => alert('The invitation link has been copied!')}>
                                <Text style={styles.buttonText}>Invite a Friend!</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                            style={[styles.buttonWrapper, { backgroundColor: item.liveNow ? '#F37C71' : '#F37C71' }]}
                            onPress={() => alert('Loading ..')}>
                                <Text style={styles.buttonText}>
                                    {item.liveNow ? 'Join Now' : 'Set a Remender'}
                                </Text>
                            </TouchableOpacity>  

                        </View>
                            
                    </View>

                </View>

            </ScrollView>
        </View>
    );
};



// Developing the Style Sheet
const styles = StyleSheet.create ({
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

    backWrapper:{
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
    itemLocation: {
        marginTop: 2,
        color: colors.textDark,
        fontSize: 18,
    },
    itemDes: {
        marginTop: 2,
        color: colors.textDark,
        fontSize: 15,
        lineHeight: 20,
        textAlign: "justify"
    },

    // CATEGORY SECTION
    dicoverCate: {
        width: 350,
        height: 98,
        justifyContent: 'flex-end',
        marginLeft: -5,
    },


    infoWrapper: {
        flexDirection: 'row',
        marginHorizontal: 25,
        marginLeft: -2.5,
        marginTop: 10,
        justifyContent: 'space-between',
    },

    infoTitle: {
        // fontFamily: 'Lato-Bold',
        fontSize: 10,
        color: colors.gray,
    },
    infoTextWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 5,
    },
    infoText: {
        // fontFamily: 'Lato-Bold',
        fontSize: 18,
        color: colors.textSubLight,
        fontWeight: 'bold',
    },


    speakerImage:{
        width: 51,
        height: 51,
        marginHorizontal: 10,
        // marginBottom: 30,
    },

    speakerName:{
        marginHorizontal: 25,
        color: colors.textDark,
        fontSize: 15,
        lineHeight: 20,
        textAlign: "justify",
        marginLeft: 8, 
        marginBottom: 15,
        fontWeight: 'bold',
    },



    buttonWrapper: {
        marginHorizontal: 15,
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
        // fontFamily: 'Lato-Bold',
        fontSize: 18,
        color: colors.textLight,
    },


});




export default LiveDetails;