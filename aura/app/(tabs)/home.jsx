import { Alert, FlatList, Image, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import {getAllPosts,getLatestPosts} from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  
  const {data:posts,refetch,isLoading} = useAppwrite(getAllPosts);

  const {data:latestposts} = useAppwrite(getLatestPosts);

  const onRefresh = async ()=>{
    setRefreshing(true);

    // re call posts.... to see if new videos appears
    await refetch();

    setRefreshing(false);
  }


  

  return (
    <SafeAreaView className="bg-primary h-full">

      <FlatList
        data={posts}
        keyExtractor={(item)=>item.$id}
        key={(item)=>item.$id}
        renderItem={({item})=>(
            <VideoCard data={item} />
            
        )}
        ListHeaderComponent={()=>(
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className=" text-2xl font-pmedium text-white">
                  Manuel
                </Text>
              </View>

              {/* image */}
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode='contain'              
                  />
              </View>
            </View>

            {/* search component */}
            <SearchInput/>

            {/* latest videos */}
            <View className="w-full flex-1 pt-5 pb-8">
                <Text className="text-gray-100 text-lg font-pregular mb-3">
                  Latest Videos
                </Text>

                <Trending posts={latestposts ?? []}/>
            </View>
          </View>
        )}
        // shows when there is no data
        ListEmptyComponent={()=>(
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first to upload a video"
          />
        )}
        refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />}
      />

    </SafeAreaView>
  )
}

export default Home

