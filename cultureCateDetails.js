import React, { useEffect, useState } from "react";
import { StyleSheet, View, ImageBackground, TouchableOpacity, ScrollView, Text, Image, FlatList } from "react-native";
import colors from "../assets/colors/colors";
import { WebView } from 'react-native-webview';
import Feather from "react-native-vector-icons/Feather";
import Entypo from 'react-native-vector-icons/Entypo';
import { usePocketBase } from "../hooks/usePocketbase";

// Load fonts
Feather.loadFont();
Entypo.loadFont();

const CultureCategoryDetails = ({ route, navigation }) => {
    // Hooks for fetching and managing data
    const { getCultureCategory, getCategoryData } = usePocketBase();
    const [cultureCategory, setCultureCategory] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false); // State variable to track video playing status

    // Fetching data
    useEffect(() => {
        const loadData = async () => {
            const cultData = await getCultureCategory();
            console.log(cultData);
            setCultureCategory(cultData);

            const cateData = await getCategoryData();
            console.log(cateData);
            setCategoryData(cateData);
        };
        loadData();
    }, []);

    // Extracting item from route params
    const { item } = route.params;

    // State variable for like status
    const [isLiked, setLiked] = useState(item.liked);

    // Function to handle updating like status
    const handleUpdateLike = async () => {
        try {
            // Update like status in the backend
            await updateLike(item.id, { liked: !isLiked });

            // Update local state to reflect the change
            setLiked(!isLiked);
        } catch (error) {
            console.error('Error updating like:', error);
        }
    };

    // Function to start video playback
    const startVideo = () => {
        setIsVideoPlaying(true);
    };

    // Filter category images based on item id
    const filteredCategoryImages = cultureCategory.filter(categoryItem => categoryItem.id === item.id);

    // Render each image in a FlatList
    const renderPic = ({ item }) => {
        return (
            <ImageBackground
                style={styles.dicoverCate}
                imageStyle={styles.cateImg}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.img1 }} style={styles.img} />
                    <Image source={{ uri: item.img2 }} style={styles.img} />
                    <Image source={{ uri: item.img3 }} style={styles.img} />
                    <Image source={{ uri: item.img4 }} style={styles.img} />
                </View>
            </ImageBackground>
        )
    }

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
                    {/* Heart icon for liking */}
                    <View style={styles.heartWrapper}>
                        <TouchableOpacity onPress={handleUpdateLike}>
                            <Entypo name={isLiked ? 'heart' : 'heart-outlined'} size={35} color={isLiked ? colors.heart : colors.grey} />
                        </TouchableOpacity>
                    </View>
                    {/* Main content wrapper */}
                    <View style={styles.contentWrapper}>
                        <View key={item.id}>
                            {/* Title */}
                            <Text style={styles.itemLabel}>Title</Text>
                            <Text style={styles.itemTitle}>{item.title}</Text>

                            {/* Render if item is available */}
                            {item.available && (
                                <>
                                    {/* Introduction */}
                                    <Text style={styles.itemLabel}>Introduction</Text>
                                    <Text style={styles.itemDes}>{item.description}</Text>

                                    {/* Image gallery */}
                                    <View style={styles.imageContainer}>
                                        <FlatList
                                            data={filteredCategoryImages}
                                            renderItem={renderPic}
                                            keyExtractor={(item) => item.id.toString()}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                        />
                                    </View>

                                    {/* Additional description */}
                                    <Text style={styles.itemDes}>{item.sub_description2}</Text>

                                    {/* Video player */}
                                    <TouchableOpacity onPress={startVideo}>
                                        {isVideoPlaying ? (
                                            <View>
                                                <WebView
                                                    style={styles.videoContainer}
                                                    javaScriptEnabled={true}
                                                    domStorageEnabled={true}
                                                    source={{ uri: item.video }}
                                                />
                                                <Image
                                                    source={{ uri: item.videoCover }}
                                                    style={styles.videoCoverImage}
                                                />
                                            </View>
                                        ) : (
                                                <Image
                                                    source={{ uri: item.videoCover }}
                                                    style={styles.videoCoverImage}
                                                />
                                            )}
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

const styles = StyleSheet.create({
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
        height: 950,
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
        textAlign: "justify",
    },
    img: {
        width: 175,
        height: 100,
        justifyContent: 'flex-end',
        marginRight: 11,
        marginTop: 12,
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
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        marginTop: 5,
        paddingHorizontal: -50,
    },
    videoContainer: {
        width: '100%',
        height: 200,
    },
    videoCoverImage: {
        marginBottom: 10,
        marginTop: 10,
        width: 318,
        height: 111,
        marginLeft: 5,
    },
});

export default CultureCategoryDetails;
