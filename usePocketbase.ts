
import PocketBase from 'pocketbase';
import { useCallback } from 'react';

export interface culture_data {
    title: string;
    description: string;
    backgImg: string;
    image: string;
    liked: boolean;
    location: string;
    mostView: boolean;
    available: boolean;
    id?: string;
    collectionId?: string;
    collectionName?: string;
    created?: string;
    updated?: string;
}

export interface category_data {
    title: string;
    type: string;
    image: string;
    backgImg: string;
    id?: string;
    collectionId?: string;
    collectionName?: string;
    created?: string;
    updated?: string;
}

export interface culture_category_data {
    title: string;
    image: string;
    culture_id: string;
    category_id: string;
    description: string;
    sub_description2: string;
    video: string;
    backgImg: string;
    img1: string;
    img2: string;
    img3: string;
    img4: string;
    videoCover: string;
    available: boolean;
    id?: string;
    collectionId?: string;
    collectionName?: string;
    created?: string;
    updated?: string;
}

export interface event_data {
    title: string;
    image: string;
    culture_id: string;
    description: string;
    date: string;
    time: string;
    price: string;
    url: string;
    location: string;
    backgImg: string;
    rating: string;
    duration: string;
    id?: string;
    collectionId?: string;
    collectionName?: string;
    created?: string;
    updated?: string;
}

export interface post_data {
    title: string;
    image1: string;
    image2: string;
    image3: string;
    usersID: string;
    description: string;
    liked: boolean;
    location: string;
    rating: string;
    id?: string;
    collectionId?: string;
    collectionName?: string;
    created?: string;
    updated?: string;
}

export interface live_data {
    title: string;
    image: string;
    culture_id: string;
    description: string;
    date: string;
    time: string;
    backgImg: string;
    speaker: string;
    speaker_pic: string;
    liveNow: boolean;
    liked: boolean;
    id?: string;
    collectionId?: string;
    collectionName?: string;
    created?: string;
    updated?: string;
}

export interface user_data {
    username: string;
    ambassador: boolean;
    email: string;
    password: string;
    profilePic: string;
    id?: string;
    collectionId?: string;
    collectionName?: string;
    created?: string;
    updated?: string;
}



export const usePocketBase = () => {

    // Pocketbase Admin UI
    const pb = new PocketBase('http://127.0.0.1:8090');

    // Function to get data
    const getCulturesData = async() => {
        return pb.collection('cultureData').getFullList(200, {sort: 'created', order: 'asc' })
    }
    
    // Function to update
    const updateLike = async (recordId: string, newData: Partial<culture_data>) => {
        return pb.collection('cultureData').update(recordId, newData);
    };

    // Function to get data
    const getCategoryData = async () => {
        return pb.collection('categoryData').getFullList(200, { sort: 'created'});
    };

    // Function to get data
    const getCultureCategory  = async () => {
        return pb.collection('cultureCategory').getFullList(200, { sort: 'created', order: 'asc' });
    };

    // Function to get data
    const getLiveData  = async () => {
        return pb.collection('liveData').getFullList(200, { sort: 'created', order: 'asc' });
    };

    // Function to get data
    const getEventData  = async () => {
        return pb.collection('eventData').getFullList(200, { sort: 'created', order: 'asc' });
    };

    const getUserData = async () => {
        return pb.collection('user').getFullList(200, { sort: 'created', order: 'asc' });

    };

    // Function to get data
    const getPostData  = async () => {
        return pb.collection('postData').getFullList(200, { sort: 'created', order: 'asc' });
    };

    // Function to get data
    const getService = async () => {
        return pb.collection('servicesData').getFullList(200, { sort: 'created', order: 'asc' });
    };


    return {
        getCulturesData,
        updateLike,

        getCategoryData,
        getCultureCategory,
        
        getLiveData,
        getEventData,
        getPostData,
        
        getUserData,
        getService
        
    };
};

