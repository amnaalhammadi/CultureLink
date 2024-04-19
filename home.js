import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, SafeAreaView } from "react-native";
import colors from "../assets/colors/colors";
import { ScrollView } from 'react-native-virtualized-view'
import Profile from "../Components/profile";
import Feather from "react-native-vector-icons/Feather";
import Entypo from 'react-native-vector-icons/Entypo';
import headerimg from "../assets/Images/headerBG.png";
import boldFont from "../assets/fonts/Roboto-Bold.ttf";
import { FlatList } from "react-native-gesture-handler";
import { usePocketBase } from "../hooks/usePocketbase";

// Loading the font
Feather.loadFont();
Entypo.loadFont();

const Home = ({ navigation }) => {
    const { getCulturesData, getCategoryData, getLiveData, getEventData } = usePocketBase();
    const [cultureData, setCulturesData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [liveData, setLiveData] = useState([]);
    const [eventData, setEventData] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await getCulturesData()
                console.log(result)
                setCulturesData(result)

                const result1 = await getCategoryData()
                console.log(result1)
                setCategoryData(result1)

                const result2 = await getLiveData()
                console.log(result2)
                setLiveData(result2)

                const result3 = await getEventData()
                console.log(result3)
                setEventData(result3)
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle the error (e.g., show an error message to the user)
            }
        }
        loadData()
    }, [])

    // creating variables to store data
    const mostViewedCultures = cultureData.filter(item => item.mostView);
    const liveNow = liveData.filter(item => item.liveNow);

    // Rendering the list of country for most viewed countries
    const renderCountryItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('Details', { item: item })
                }>
                <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.dicoverCountry}
                    imageStyle={styles.countryImg}
                >
                </ImageBackground>
            </TouchableOpacity>
        );
    };

    // Rendering the list of category items
    const renderCateItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('CateDetails', { item: item, }
                    )}>
                <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.dicoverCate}
                    imageStyle={styles.cateImg}>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    // Rendering the list of lives
    const renderLiveItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('LiveDetails', { item: item, }
                )}>
                <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.dicoverLive}
                    imageStyle={styles.liveImg}>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    // Rendering the list of events
    const renderEventItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('EventDetails', { item: item, }
                )}>
                <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.dicoverEvent}
                    imageStyle={styles.liveImg}>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    // User Interface
    return (
        <View style={styles.container}>
            <ScrollView>

                {/* Header */}
                <SafeAreaView >
                    <ImageBackground
                        source={headerimg}
                        style={styles.BGimg}>
                        <View style={styles.menuWrapper}>
                            <Feather name="menu" size={23} color={colors.background} style={styles.menuIcon} />
                            <Text size={23} color={colors.background} style={styles.title}>CULTURE LINK</Text>
                            <Feather name="bell" size={23} color={colors.background} style={styles.notif} />
                        </View>
                    </ImageBackground>
                </SafeAreaView>

                <View style={styles.headerWrapper}>

                    {/* Most viewed countries */}
                    <View style={styles.mostViewed_Wapper}>
                        <Text style={styles.h1Title}>Most Viewed Cultures</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ListCountry')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.country_Wapper}>
                        <FlatList
                            data={mostViewedCultures} // display only the most viewed
                            renderItem={renderCountryItem}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    {/* Categories */}
                    <View style={styles.mostViewed_Wapper}>
                        <Text style={styles.h1Title}>Categories</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ListCategory')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.category_Wapper}>
                        <FlatList
                            data={categoryData}
                            renderItem={renderCateItem}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    {/* Lives */}
                    <View style={styles.mostViewed_Wapper}>
                        <Text style={styles.h1Title}>Live Now</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ListLive')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.live_Wapper}>
                        <FlatList
                            data={liveNow}
                            renderItem={renderLiveItem}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    {/* Events */}
                    <View style={styles.mostViewed_Wapper}>
                        <Text style={styles.h1Title}>Events</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ListEvent')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.live_Wapper}>
                        <FlatList
                            data={eventData}
                            renderItem={renderEventItem}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
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
    BGimg: {
        height: 225,
        width: 395,
        marginTop: -10,
        marginVertical: -90,
        marginBottom: -20,
    },
    headerWrapper: {
        backgroundColor: colors.background,
        height: 900,
        marginTop: -5,
        borderRadius: 25,
    },
    menuWrapper: {
        marginHorizontal: 40,
        marginVertical: 30,
        marginLeft: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notif: {
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        marginLeft: 20,
        textAlign: 'center',
        color: colors.background,
    },

    // MOST VIEWED SECTION 
    mostViewed_Wapper: {
        marginHorizontal: 20,
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    h1Title: {
        fontSize: 23,
        color: colors.textDark,
    },
    seeAll: {
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
    dicoverCate: {
        width: 140,
        height: 48,
        justifyContent: 'flex-end',
        marginRight: -30,
        marginLeft: 5,
        marginTop: 12,
    },
    dicoverLive: {
        width: 303,
        height: 100,
        justifyContent: 'flex-end',
        marginRight: -11,
        marginLeft: 13,
        marginTop: 12,
    },
    dicoverEvent: {
        width: 209,
        height: 157,
        justifyContent: 'flex-end',
        marginRight: -11,
        marginLeft: 13,
        marginTop: 12,
    },

});

export default Home;
