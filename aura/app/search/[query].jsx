import { FlatList,Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import {searchPosts} from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {

  const {query} = useLocalSearchParams();
  const {data:posts,refetch} = useAppwrite(()=>searchPosts(query));
    useEffect(() => {
      refetch()
     },[query])


  

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
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Result
            </Text>
            <Text className=" text-2xl font-pmedium text-white">
              {query}
            </Text>
              {/* search component */}
            <View className="mt-6 mb-8">
             <SearchInput initialQuery={query}/>
            </View>
          </View>
        )}
        // shows when there is no data
        ListEmptyComponent={()=>(
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />

    </SafeAreaView>
  )
}

export default Search

