import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, TextInput } from "react-native";
import colors from "../assets/colors/colors";
import Feather from "react-native-vector-icons/Feather";
import Entypo from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from 'react-native-virtualized-view'
import boldFont from "../assets/fonts/Roboto-Bold.ttf";
import { FlatList } from "react-native-gesture-handler";
import { usePocketBase } from "../hooks/usePocketbase";

// Loading the font
Feather.loadFont();
Entypo.loadFont();

const ListCategory = ({ navigation }) => {
    // Preparing the connection with the backend
    const { getCultureCategory } = usePocketBase();
    const [cultureCategory, setCultureCategory] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [availableNow, setAvailableNow] = useState([]);
    const [stayTuned, setStayTuned] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await getCultureCategory();
                console.log(result);
                setCultureCategory(result);

                setAvailableNow(result.filter(item => item.available)); // Filter most viewed cultures
                setStayTuned(result.filter(item => !item.available)); // Filter items where liveNow is false
            } catch (error) {
                console.error("Error fetching event data:", error);
                // Handle error, e.g., show an error message to the user
            }
        };
        loadData();
    }, []);

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const filteredCate = cultureCategory.filter(cate => {
        return cate.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const renderCateItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('CultureCategoryDetails', { item: item })}
            >
                <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.dicoverCate}
                    imageStyle={styles.countryImg}
                />
            </TouchableOpacity>
        );
    };

    // User Interface
    return (
        <View style={styles.container}>
            <ScrollView>

                <View style={styles.headerWrapper}>

                    {/* Header */}
                    <SafeAreaView>
                        <View style={styles.menuWrapper}>
                            {/* Back Icon */}
                            <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                                <Entypo name='chevron-left' size={23} color={colors.activeIcon} />
                            </TouchableOpacity>
                            {/* Search Icon */}
                            <Feather name="search" size={23} color={colors.activeIcon} style={styles.searchIcon} />
                            {/* Search bar */}
                            <View style={styles.searchContainer}>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search category...  "
                                    value={searchQuery}
                                    onChangeText={handleSearch} />
                            </View>
                        </View>
                    </SafeAreaView>

                    {/* All Lives */}
                    <View style={styles.allViewed_Wapper}>
                        <Text style={styles.h1Title}>Available Now</Text>
                    </View>
                    {/* List of Lives */}
                    <View style={styles.liveWrapper}>
                        <FlatList
                            data={availableNow}
                            renderItem={renderCateItem}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    {/* All Lives */}
                    <View style={styles.allViewed_Wapper}>
                        <Text style={styles.h1Title}>Coming Soon</Text>
                    </View>
                    {/* List of Lives */}
                    <View style={styles.liveWrapper}>
                        <FlatList
                            data={stayTuned}
                            renderItem={renderCateItem}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    {/* Explore All Cultures */}
                    <View style={styles.allViewed_Wapper}>
                        <Text style={styles.h1Title}>Explore All Category</Text>
                    </View>
                    <View style={styles.country_Wapper}>
                        <FlatList
                            data={filteredCate}
                            renderItem={renderCateItem}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={1}
                            showsVerticalScrollIndicator={false}
                            horizontal={false}
                        />
                    </View>

                </View>

            </ScrollView>
        </View>
    );
};

// Style Sheet
const styles = StyleSheet.create({

    container: {
        flex: 1,
        color: colors.textDark,
        backgroundColor: colors.background
    },
    searchContainer: {
        paddingHorizontal: -20,
        paddingVertical: 10,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: colors.activeIcon,
        borderRadius: 8,
        padding: 6,
    },
    flatListContainer: {
        alignItems: 'center',
    },
    discoverCountry: {
        width: 180,
        height: 230,
        justifyContent: 'flex-end',
        margin: 5,
    },
    countryImg: {
        borderRadius: 10,
    },

    h1Title: {
        fontSize: 23,
        color: colors.textDark,
        marginBottom: 10
    },
    searchIcon: {
        marginHorizontal: 20,
        marginRight: -100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    searchWrapper: {
        marginRight: 25,
        marginTop: -50,
        marginBottom: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    menuWrapper: {
        marginHorizontal: 30,
        marginVertical: 15,
        marginTop: -40,
        marginBottom: -30,
        marginLeft: 29,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    // MOST VIEWED SECTION 
    mostViewed_Wapper: {
        marginHorizontal: 20,
        marginTop: -25,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    // MOST VIEWED SECTION 
    allViewed_Wapper: {
        marginHorizontal: 20,
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    dicoverCountry: {
        width: 180,
        height: 230,
        justifyContent: 'flex-end',
        marginRight: -11,
        marginLeft: 13,
        marginTop: 12,
    },
    countryTitle: {
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
        fontSize: 13,
        color: colors.locationBG,
        textAlign: 'left',

    },

    // CATEGORY SECTION
    dicoverCate: {
        marginLeft: 15,
        width: 320,
        height: 90,
        justifyContent: 'flex-end',
    },
});

export default ListCategory;
