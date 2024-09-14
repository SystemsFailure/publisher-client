import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCov3lN2s_pX_lYyD5PAuJEGbnXv08cI3I",
    authDomain: "sds-publisher.firebaseapp.com",
    projectId: "sds-publisher",
    storageBucket: "sds-publisher.appspot.com",
    messagingSenderId: "841125871272",
    appId: "1:841125871272:web:2cca5ba6241108691f8c9d",
    measurementId: "G-7EZ7P22TR9"
};


export const run = () => {
    console.debug('[FIREBASE] - INIT SUCCESSFULY')
    const appBase = initializeApp(firebaseConfig);
    const storage = getStorage(appBase)
    return {
        storage
    }
}
