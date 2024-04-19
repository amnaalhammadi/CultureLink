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

const ListLive = ({ navigation }) => {

    // Preparing the connection with the backend
    const { getLiveData } = usePocketBase();
    const [liveData, setLiveData] = useState([]);
    const [filteredLive, setFilteredLive] = useState([]); // Initialize with all countries
    const [liveNow, setLiveNow] = useState([]);
    const [stayTuned, setStayTuned] = useState([]);

    // Fetching data
    useEffect(() => {
        const loadData = async () => {
            const result = await getLiveData();
            console.log(result);
            
            setLiveData(result);
            setFilteredLive(result); // Set filtered data initially to all data
            setLiveNow(result.filter(item => item.liveNow)); // Filter most viewed cultures
            setStayTuned(result.filter(item => !item.liveNow)); // Filter items where liveNow is false
        };
        loadData();
    }, []);

    // Rendering the live item
    const renderLiveItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('LiveDetails', { item: item })
                }>
                <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.discoverLive}
                    imageStyle={styles.liveImg}
                />
            </TouchableOpacity>
        );
    };

    // Preparing the Search Query
    const [searchQuery, setSearchQuery] = useState('');

    // Handling the search
    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = liveData.filter(live => live.title.toLowerCase().includes(text.toLowerCase()));
        setFilteredLive(filtered);
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
                                    placeholder="Search lives..."
                                    value={searchQuery}
                                    onChangeText={handleSearch} />
                            </View>
                        </View>
                    </SafeAreaView>

                    {/* All Cultures */}
                    <View style={styles.allViewed_Wapper}>
                        <Text style={styles.h1Title}>Live Now</Text>
                    </View>
                    {/* List of Lives */}
                    <View style={styles.liveWrapper}>
                        <FlatList
                            data={liveNow}
                            renderItem={renderLiveItem}
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
                            renderItem={renderLiveItem}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    {/* All Lives */}
                    <View style={styles.allViewed_Wapper}>
                        <Text style={styles.h1Title}>All Lives</Text>
                    </View>
                    {/* List of Lives */}
                    <View style={styles.liveWrapper}>
                        <FlatList
                            data={filteredLive}
                            renderItem={renderLiveItem}
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
    discoverLive: {
        width: 320,
        height: 110,
        justifyContent: 'flex-end',
        margin: 5,
    },
    liveImg: {
        borderRadius: 10,
    },

    searchIcon: {
        marginHorizontal: 20,
        marginRight: -100,
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

    // LIVE SECTION 
    liveWrapper: {
        marginHorizontal: 20,
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    allViewed_Wapper: {
        marginHorizontal: 20,
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    h1Title: {
        // fontFamily: 'Leto',
        fontSize: 23,
        color: colors.textDark,
    },
    
});

export default ListLive;
