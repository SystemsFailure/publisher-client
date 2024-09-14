import { storage } from "@/main";
import { 
    ref, 
    list, 
    uploadBytesResumable, 
    deleteObject, 
    getDownloadURL, 
    uploadBytes
} from "firebase/storage";

export class FirebaseStorage {
    constructor() {
      console.debug(
            '[DATA OF STORAGE] \n',
            `MAX operationTime: ${storage.maxOperationRetryTime}  \n`,
            `MAX uploadTime: ${storage.maxUploadRetryTime}  \n`,
        )
    }
  
    // Получить все файлы
    async getAllFiles(limit, limit2) {
      const listRef = ref(storage, 'files/uid');
      const firstPage = await list(listRef, { maxResults: limit });
      if (firstPage.nextPageToken) {
        const secondPage = await list(listRef, {
          maxResults: limit2,
          pageToken: firstPage.nextPageToken,
        });
        return secondPage
      }
    }
  
    // Удалить файл
    async deleteFile(fileName) {
      const localRef = ref(storage, fileName);
      return await deleteObject(localRef)
    }
  
    // Получить один файл
    getFile(fileName) {
      let __URL__ = null;
      const localRef = ref(storage, fileName);
      getDownloadURL(localRef).then(url => {
        const __httpx__ = new XMLHttpRequest();
        __httpx__.responseType = 'blob';
        __httpx__.open('GET', url)
        __httpx__.send();
        __URL__ = url
      })
      return __URL__;
    }
  
    // Загрузить файл с % прогресса загрузки
    uploadFileWithProgress(file, fileName, progressCallback, handler) {
      const fileRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(fileRef, file);
  
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressCallback(Math.ceil(Number(progress)));
        },
        (error) => {
          console.error("Error uploading file: ", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            handler(url, uploadTask.snapshot.ref)
          });
        }
      );
    }

    uploadFile(file, path) {
      const storageRef = ref(storage, path);
      return uploadBytes(storageRef, file);
    }
}
