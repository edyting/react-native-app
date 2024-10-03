import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View,Image } from "react-native";
import { Redirect,router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {images} from '../constants';
import CustomButton from '../components/CustomButton.jsx'
import { useGlobalContext } from "../context/GlobalProvider";


export default function Index() {
  const {isLoading,isLoggedIn}=useGlobalContext();
  if(!isLoading && isLoggedIn) return <Redirect href="/home"/>
  return (
   <SafeAreaView className="bg-primary h-full">
    {/* to make the page scrollable on smaller screens */}
      <ScrollView contentContainerStyle={{height:'100%'}}>
          <View className="items-center justify-center w-full min-h-[85vh] px-4">
            <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
            />

            <Image 
              source={images.cards}
              className="max-w-[380px] w-full h-[300px] "
              resizeMode="contain"
            />

            {/* text area */}
            <View className="relative mt-5 ">
                <Text className='text-3xl font-bold text-white text-center'>
                  Discover Endless Possibilities With{" "}  
                  <Text className="text-secondary-200">AURA</Text>
                </Text>

                <Image
                  source={images.path}
                  className="absolute -bottom-2 -right-8 w-[136px] h-[15px]"
                  resizeMode="contain"
                />
            </View>
            <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
              Where creativity meets innovation: embark on a journey of limitless exploration with AURA 
            </Text>

            <CustomButton
              title="Continue with Email"
              handlePress={()=>router.push('/sign-in')}
              containerStyles='w-full mt-7'
              textStyles=''
            />            
          </View>
      </ScrollView>
          {/* to see battery percentage and time -removing this line will potentially trap the users */}
      <StatusBar backgroundColor="#161622" style="light"/>
   </SafeAreaView>
  );
}
