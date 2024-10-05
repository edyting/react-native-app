import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';
// import SignUp from '../app/(auth)/sign-up';

export const appwriteConfig ={
    endpoint:"https://cloud.appwrite.io/v1",
    platform:"com.edyting.aura",
    projectId:"66f76f3100310315a66a",
    databaseId:"66f772890026c41621d5",
    userCollectionId:"66f772c5001fedaabec9",
    videoCollectionId:"66f773340000a155b4b7",
    storageId:"66f77596000907d9bd08"
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;

const account = new Account(client); 
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// making it a function so that it can be used elsewhere
export const createUser= async (email,password,username)=>{
    // Register User
    try {
        const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
        );

        if(!newAccount) throw Error; 
        const avatarUrl = avatars.getInitials(username);

        await signIn(email,password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )
        return newUser;
        
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};


export const signIn = async(email,password) =>{
    try {
        const session = await account.createEmailPasswordSession(email,password)
        return session
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () =>{
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        
    }
}


// getting all posts

export const getAllPosts = async()=>{
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
        
    }
}

export const getLatestPosts = async()=>{
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.orderDesc('$createdAt',Query.limit(7))]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
        
    }
}

export const searchPosts = async(query)=>{
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.search('title',query)]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
        
    }
}

export const getUserPosts = async(userId)=>{
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.equal('creator',userId)]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
        
    }
}


export const signOut = async ()=>{
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        throw new Error(error)
    }
}

export const getFilePreview = async (fileId, type) =>{
    let fileUrl;

    try {
        if(type === "video"){
            fileUrl = storage.getFileView(storageId, fileId)
        } else if (type === "image"){
            fileUrl = storage.getFilePreview(storageId,fileId,2000,2000,'top',100)
        } else{
            throw new Error('Invalid file type')
        }

        if(!fileUrl) throw Error;

        return fileUrl;

    } catch (error) {
      throw new Error(error);
    }

}

export const uploadFile = async (file,type) =>{
    if(!file) return;

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    };

    try {
        const uploadedFile= await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id,type);

        return fileUrl;

    } catch (error) {
        throw new Error(error);
    }
}

export const createVideo = async (form)=>{
    try {
        const [thumbnailUrl,videoUrl] = await Promise.all([
            uploadFile(form.thumbnail,'image'),
            uploadFile(form.video,'video'),
        ])

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId, appwriteConfig.videoCollectionId,ID.unique(),{
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        )

        return newPost;
    } catch (error) {
       throw new Error(error); 
    }
}