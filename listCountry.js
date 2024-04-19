import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, TextInput } from "react-native";
import colors from "../assets/colors/colors";
import Feather from "react-native-vector-icons/Feather";
import Entypo from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import { usePocketBase } from "../hooks/usePocketbase";
import { ScrollView } from 'react-native-virtualized-view'

// Loading the font
Feather.loadFont();
Entypo.loadFont();

const ListCountry = ({ navigation }) => {

    // Preparing the connection with the backend
    const { getCulturesData } = usePocketBase();
    const [cultureData, setCulturesData] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]); // Initialize with all countries
    const [mostViewedCultures, setMostViewedCultures] = useState([]);

    // Fetching data
    useEffect(() => {
        const loadData = async () => {
            const result = await getCulturesData();
            console.log(result);
            setCulturesData(result);
            setFilteredCountries(result); // Set filtered data initially to all data
            setMostViewedCultures(result.filter(item => item.mostView)); // Filter most viewed cultures
        };
        loadData();
    }, []);

    // Rendering the country data
    const renderCountryItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('Details', { item: item })
                }>
                <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.discoverCountry}
                    imageStyle={styles.countryImg}
                />
            </TouchableOpacity>
        );
    };

    // Preparing the Search Query
    const [searchQuery, setSearchQuery] = useState('');

    // Handling the search
    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = cultureData.filter(country => country.title.toLowerCase().includes(text.toLowerCase()));
        setFilteredCountries(filtered);
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
                                    placeholder="Search countries..."
                                    value={searchQuery}
                                    onChangeText={handleSearch} />
                            </View>
                        </View>
                    </SafeAreaView>

                    {/* Most Viewed Cultures */}
                    <View style={styles.mostViewed_Wapper}>
                        <Text style={styles.h1Title}>Most Viewed Cultures</Text>
                    </View>
                    <View style={styles.country_Wapper}>
                        <FlatList
                            data={mostViewedCultures}
                            renderItem={renderCountryItem}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    {/* All Cultures */}
                    <View style={styles.allViewed_Wapper}>
                        <Text style={styles.h1Title}>All Cultures</Text>
                    </View>
                    <View style={styles.country_Wapper}>
                        <FlatList
                            data={filteredCountries}
                            renderItem={renderCountryItem}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={2}
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
const styles = StyleSheet.create ({

    // HEADER SECTION
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
        // fontFamily: 'Leto',
        fontSize: 23,
        color: colors.textDark,
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



export default ListCountry;
