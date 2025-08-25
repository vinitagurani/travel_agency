import { ID, OAuthProvider, Query } from "appwrite";
import { account, database, appwriteConfig } from './client';
import { redirect } from "react-router";

export const loginWithGoogle = async () => {
    try {
        account.createOAuth2Session(OAuthProvider.Google)

    }
    catch (e) {
        console.log('message:loginWithGoogle',e);
    }
}
export const logoutUser = async () => {
    try {
        await account.deleteSession('current');
        return true;
    }
    catch (e) {
        console.log('message:logoutUser', e);
        return false;
    }
}
export const getUser = async () => {
    try {
        const user = await account.get();
        if (!user) return redirect('/sign-in');
        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [
                Query.equal('accountId', user.$id),
                Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId']),
            ]
        );
    }
    catch (e) {
        console.log(e);
    }
}
export const getGooglePicture = async () => {
    try {
        const session = await account.getSession('current');
        const oAuthToken = session.providerAccessToken;
        if (!oAuthToken) {
            console.log('No OAuth token found');
            return null;
        }
        const response = await fetch('https://www.googleapis.com/v1/people/me?personFields=photos', {
            headers: {
                Authorization: `Bearer ${oAuthToken}`,
            },
        });
        if (!response.ok) {
            console.log("Failed to fetch Google profile picture");
            return null;
        }
        const data = await response.json();
        const photoUrl = data.photos && data.photos.length > 0 ? data.photos[0].url : null;

        return photoUrl;
    }
    catch (e) {
        console.log('message:getGooglePicture',e);
    }
}
export const storeUserData = async () => {
    try {
        // Get current authenticated user
        const user = await account.get();
        if (!user) {
            console.log('No authenticated user found');
            return null;
        }

        // Check if user already exists in database
        const { documents: existingUsers } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal('accountId', user.$id)]
        );

        // If user already exists, return existing user data
        if (existingUsers.length > 0) {
            console.log('User already exists in database');
            return existingUsers[0];
        }

        // Get Google profile picture
        const imageUrl = await getGooglePicture();

        // Create new user document
        const userData = {
            accountId: user.$id,
            name: user.name,
            email: user.email,
            imageUrl: imageUrl || '', // Use Google photo or empty string as fallback
            joinedAt: new Date().toISOString(),
        };

        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(), // Let Appwrite generate unique ID
            userData
        );

        console.log('User data stored successfully');
        return newUser;
    }
    catch (e) {
        console.log('message:storeUserData', e);
        return null;
    }
}
export const getExistingUser = async () => {
    try {
        const user = await account.get();
        if (!user) {
            console.log('No authenticated user found');
            return null;
        }
        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal('accountId', user.$id)]
        );
        if (documents.length > 0) {
            return documents[0];
        } else {
            console.log('User not found in database');
            return null;
        }
    }
    catch (e) {
        console.log(e);
    }
}