import React , { useEffect, useState } from "react";
import { Text, View, StyleSheet, ImageBackground, Image, TouchableOpacity, ScrollView} from "react-native";
import colors from "../assets/colors/colors";
import Feather from "react-native-vector-icons/Feather";
import Entypo from 'react-native-vector-icons/Entypo';
import { usePocketBase } from "../hooks/usePocketbase";

// loading the font
Feather.loadFont();
Entypo.loadFont();

const ServiceDetails = ({route, navigation}) => {

    // Preparing the connection with the backend
    const { getService } = usePocketBase();
    const [ serviceDeatils, setServiceDeatils ] = useState([]);

    // Fetching data
    useEffect(() => {
        const loadData = async() => {
            const serviceDeatils = await getService()
            console.log(serviceDeatils)
            setServiceDeatils(serviceDeatils)

        }
        loadData()
    }, [])

    // variables to store data
    const {item} = route.params;

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

                    <View style={styles.contentWrapper}>
                        <View key={item.id}> 

                            <Text style={styles.itemLabel}>Title</Text>
                            <Text style={styles.itemTitle}>{item.title}</Text>


                            {/*  only be rendered if item.available is true */}
                            {item.available && (
                                <>
                                    <Text style={styles.itemLabel}>Introduction</Text>
                                    <Text style={styles.itemDes}>{item.description}</Text>

                                    <Text style={styles.itemLabel}>Service Steps</Text>

                                    <View style={styles.infoWrapper}>
                                        <View style={styles.stepWrapper}>
                                            <Text style={styles.itemDes}>1</Text>
                                        </View>

                                        <Text style={styles.itemstep}>{item.step_1}</Text>
                                    </View>

                                    <View style={styles.infoWrapper}>
                                        <View style={styles.stepWrapper}>
                                            <Text style={styles.itemDes}>2</Text>
                                        </View>

                                        <Text style={styles.itemstep}>{item.step_2}</Text>
                                    </View>

                                    <View style={styles.infoWrapper}>
                                        <View style={styles.stepWrapper}>
                                            <Text style={styles.itemDes}>3</Text>
                                        </View>

                                        <Text style={styles.itemstep}>{item.step_3}</Text>
                                    </View>

                                    <View style={styles.infoWrapper}>
                                        <View style={styles.stepWrapper}>
                                            <Text style={styles.itemDes}>4</Text>
                                        </View>

                                        <Text style={styles.itemstep}>{item.step_4}</Text>
                                    </View>

                                    <TouchableOpacity
                                    style={styles.buttonWrapper}
                                    onPress={() => alert('To start using the service, please verify your account by clicking on the link sent to your email!')}>
                                        <Text style={styles.buttonText}>Start Now</Text>
                                    </TouchableOpacity>

                                </>
                            )}

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
        height: 346,
        width: 395,
        marginBottom: -35,
    },

    descriptionWrapper: {
        flex: 1,
        backgroundColor: colors.background,
        marginTop: -20,
        borderRadius: 25,
        height: 770,
    },
    backIcon: {
        marginLeft: 26,
        marginTop: 30,
    },

    buttonWrapper: {
        marginHorizontal: 10,
        marginTop: 35,
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
    
    buttonText: {
        // fontFamily: 'Lato-Bold',
        fontSize: 18,
        color: colors.textLight,
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

    itemstep: {
        marginTop: 10,
        color: colors.textDark,
        fontSize: 15,
        lineHeight: 20,
        textAlign: "justify",
        marginLeft: 30
    },

    stepWrapper: {
        // position: 'absolute', // full control of position
        // right: 40,
        // top: -20,
        width: 35,
        height: 35,
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

    infoWrapper: {
        flexDirection: 'row',
        marginTop: 15,
        marginLeft: 10
    },

    // CATEGORY SECTION
    img: {
        width: 175,
        height: 100,
        justifyContent: 'flex-end',
        marginRight: 11,
        // marginLeft: 13,
        marginTop: 12,
    },

    imageContainer: {
        flexDirection: 'row', // Display images horizontally
        justifyContent: 'space-between',
        marginBottom: 8,
        marginTop: 5,
        paddingHorizontal: -50,
    },

    videoContainer: {
        width: '100%', // Use 100% of the available width
        height: 200, // Adjust height based on your design requirements
    },
    videoCoverImage: {
        // width: '100%',
        marginBottom: 10,
        marginTop: 10,
        width: 318,
        height: 111,
        marginLeft: 5
    },

});




export default ServiceDetails;