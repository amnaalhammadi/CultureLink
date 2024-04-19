import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, ImageBackground, Dimensions, TouchableOpacity } from "react-native";
import colors from "../assets/colors/colors";
import { usePocketBase } from "../hooks/usePocketbase";
import { ScrollView } from 'react-native-virtualized-view'

// loading the font
import Feather from "react-native-vector-icons/Feather";
import Entypo from 'react-native-vector-icons/Entypo';

// loading the font icons
Feather.loadFont();
Entypo.loadFont();

// Retrieve the height of the device's screen
const height = Dimensions.get("window").height;

const Details = ({ route, navigation }) => {
    // Preparing the connection with the backend
    const { getCulturesData, updateLike, getCultureCategory } = usePocketBase();
    const [cultureData, setCulturesData] = useState([]);
    const [cultureCategory, setCultureCategory] = useState([]);

    // Fetching data
    useEffect(() => {
        const loadData = async () => {
            const result = await getCulturesData();
            setCulturesData(result);

            const result1 = await getCultureCategory();
            setCultureCategory(result1);
        };
        loadData();
    }, []);

    // Variables to store data
    const { item } = route.params;
    const [isLiked, setLiked] = useState(item.liked);

    // Handle toggling the liked status
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

    // Filter culture data based on availability
    const filteredCultures = cultureCategory.filter(culture => culture.culture_id === item.id && culture.available === true);
    const filteredNA = cultureCategory.filter(culture => culture.culture_id === item.id && culture.available === false);

    // Render the list of category items
    const renderCateItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('CultureCategoryDetails', { item: item }
                )}>
                <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.dicoverCate}
                    imageStyle={styles.cateImg}>
                </ImageBackground>
            </TouchableOpacity>
        );
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
                            <Text style={styles.itemLabel}>CULTURE NAME</Text>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemLabel}>LOCATION</Text>
                            <Text style={styles.itemLocation}>{item.location}</Text>

                            {/* Only be rendered if item.available is true */}
                            {item.available && (
                                <>
                                    <Text style={styles.itemLabel}>Description</Text>
                                    <Text style={styles.itemDes}>{item.description}</Text>

                                    <Text style={styles.itemLabel}>Discover more</Text>
                                    <FlatList
                                        data={filteredCultures}
                                        renderItem={renderCateItem}
                                        keyExtractor={(item) => item.id}
                                        showsHorizontalScrollIndicator={false}
                                    />

                                    <Text style={styles.itemLabel}>Coming soon</Text>
                                    <FlatList
                                        data={filteredNA}
                                        renderItem={renderCateItem}
                                        keyExtractor={(item) => item.id}
                                        showsHorizontalScrollIndicator={false}
                                    />
                                </>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

// Stylesheet
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
        height: 900,
    },
    backIcon: {
        marginLeft: 26,
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
    backWrapper: {
        position: 'absolute',
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
        width: 330,
        height: 86,
        justifyContent: 'flex-end',
        marginLeft: -10,
    },
});

export default Details;
