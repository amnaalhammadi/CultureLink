import React, { useEffect, useState } from "react";
import { Dimensions, Text, FlatList, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import colors from "../assets/colors/colors";
import Entypo from 'react-native-vector-icons/Entypo';
import { usePocketBase } from "../hooks/usePocketbase";
import { ScrollView } from 'react-native-virtualized-view';

// Component for displaying category details
const CategoryDetails = ({ route, navigation }) => {
    // Hooks for fetching and managing data
    const { getCultureCategory } = usePocketBase();
    const [cultureCategory, setCultureCategory] = useState([]);
    const { item } = route.params;
    const [isLiked, setLiked] = useState(item.liked);

    // Fetch data on component mount
    useEffect(() => {
        const loadData = async () => {
            const result = await getCultureCategory();
            console.log(result);
            setCultureCategory(result);
        };
        loadData();
    }, []);

    // Function to handle updating like status
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

    // Filter cultures based on category and availability
    const filteredCultures = cultureCategory.filter(culture => culture.category_id === item.id && culture.available === true);
    const filteredNA = cultureCategory.filter(culture => culture.category_id === item.id && culture.available === false);

    // Render each category item as a TouchableOpacity
    const renderCateItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('CultureCategoryDetails', { item: item })}>
                <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.dicoverCate}
                    imageStyle={styles.cateImg}>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Header */}
                <ImageBackground
                    source={{ uri: item.backgImg }}
                    style={styles.BGimg}>
                    {/* Back button */}
                    <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                        <View style={styles.backWrapper}>
                            <Entypo name='chevron-left' size={23} color={colors.activeIcon} />
                        </View>
                    </TouchableOpacity>
                </ImageBackground>

                {/* Content */}
                <View style={styles.descriptionWrapper}>
                    {/* Heart icon for liking */}
                    <View style={styles.heartWrapper}>
                        <TouchableOpacity onPress={handleUpdateLike}>
                            <Entypo name={isLiked ? 'heart' : 'heart-outlined'} size={35} color={isLiked ? colors.heart : colors.grey} />
                        </TouchableOpacity>
                    </View>
                    {/* Main content wrapper */}
                    <View style={styles.contentWrapper}>
                        <View key={item.id}>
                            {/* Category type */}
                            <Text style={styles.itemLabel}>Category type</Text>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            
                            {/* Render discover more and coming soon sections if available */}
                            {item.available && (
                                <>
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

// Styles for the component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    BGimg: {
        height: 359,
        width: 395,
        marginBottom: -85,
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
    contentWrapper: {
        marginTop: 35,
        marginLeft: 35,
        marginRight: 35,
    },
    itemLabel: {
        marginTop: 24,
        marginBottom: 5,
        color: colors.textGrey,
        fontSize: 13,
        textTransform: 'uppercase',
    },
    itemTitle: {
        marginTop: 5,
        marginBottom: 25,
        color: colors.textDark,
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: 'bold',
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
    dicoverCate: {
        width: 330,
        height: 86,
        justifyContent: 'flex-end',
        marginLeft: -10,
    },
});

export default CategoryDetails;
