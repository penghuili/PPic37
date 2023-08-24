import axios from 'axios';

import apps from '../../shared/js/apps';
import {
  decryptMessage,
  decryptMessageSymmetric,
  encryptMessage,
  encryptMessageSymmetric,
} from '../../shared/js/encryption';
import generatePassword from '../../shared/js/generatePassword';
import { LocalStorage, sharedLocalStorageKeys } from '../../shared/js/LocalStorage';
import HTTP from '../../shared/react/HTTP';
import { decryptFile, encryptFile } from './encryptFile';
import asyncForEach from '../../shared/js/asyncForEach';

async function fetchUrlForUpload() {
  try {
    const { url, fileId } = await HTTP.get(apps.file37.name, `/v1/upload-url`);

    return { data: { url, fileId }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function fetchUrlForDownload(fileId) {
  try {
    const { url } = await HTTP.get(apps.file37.name, `/v1/download-url/${fileId}`);

    return { data: url, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function uploadFile(file) {
  try {
    const {
      data: { url, fileId },
    } = await fetchUrlForUpload();
    const password = generatePassword(20, true);
    const encryptedFile = await encryptFile(file, password);

    await axios.put(url, encryptedFile, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      onUploadProgress: progressEvent => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(percentCompleted);
      },
    });

    const encryptedFileName = await encryptMessageSymmetric(password, file.name);
    const encryptedPassword = await encryptMessage(
      LocalStorage.get(sharedLocalStorageKeys.publicKey),
      password
    );
    const data = await HTTP.post(apps.file37.name, `/v1/files`, {
      fileId,
      password: encryptedPassword,
      fileName: encryptedFileName,
      mimeType: file.type,
      size: file.size,
    });
    return { data: { ...data, encryptedPassword, password }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function downloadFile(fileId) {
  try {
    const { data: url } = await fetchUrlForDownload(fileId);

    const fileMeta = await HTTP.get(apps.file37.name, `/v1/files/${fileId}`);
    const decryptedPassword = await decryptMessage(
      LocalStorage.get(sharedLocalStorageKeys.privateKey),
      fileMeta.password
    );

    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const encryptedData = new Uint8Array(response.data);
    const decryptedFile = await decryptFile(encryptedData, decryptedPassword);
    const blob = new Blob([decryptedFile], { type: fileMeta.mimeType });
    const objectUrl = URL.createObjectURL(blob);

    return { data: { url: objectUrl, fileName: fileMeta.fileName }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteFile(fileId) {
  try {
    await HTTP.delete(apps.file37.name, `/v1/files/${fileId}`);

    return { data: { fileId }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchPics() {
  try {
    const data = await HTTP.get(apps.ppic37.name, `/v1/pics`);

    const decryptedPics = [];
    await asyncForEach(data, async pic => {
      const decrypted = await decryptPicContent(pic);
      decryptedPics.push(decrypted);
    });

    return { data: { items: decryptedPics }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createPic({ password, encryptedPassword, fileId, date, note, links }) {
  try {
    const encrypted = await encryptPicContent({ note, links }, password);

    const data = await HTTP.post(apps.ppic37.name, `/v1/pics`, {
      ...encrypted,
      password: encryptedPassword,
      fileId,
      date,
    });
    const decrypted = await decryptPicContent(data);

    return { data: decrypted, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updatePic(picId, { note, links }, decryptedPassword) {
  try {
    const encrypted = await encryptPicContent({ note, links }, decryptedPassword);
    const data = await HTTP.put(apps.ppic37.name, `/v1/pics/${picId}`, encrypted);
    const decrypted = await decryptPicContent(data);

    return { data: decrypted, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deletePic(pic) {
  try {
    await deleteFile(pic.fileId);
    const data = await HTTP.delete(apps.ppic37.name, `/v1/pics/${pic.sortKey}`);

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function encryptPicContent(pic, decryptedPassword) {
  const encryptedNote = pic.note
    ? await encryptMessageSymmetric(decryptedPassword, pic.note)
    : pic.note;
  const encryptedLinks = [];
  await asyncForEach(pic.links || [], async link => {
    const encryptedLinkName = await encryptMessageSymmetric(decryptedPassword, link.name);
    const encryptedLink = await encryptMessageSymmetric(decryptedPassword, link.link);
    encryptedLinks.push({ name: encryptedLinkName, link: encryptedLink });
  });

  return { ...pic, note: encryptedNote, links: encryptedLinks };
}

async function decryptPicContent(pic) {
  const decryptedPassword = await decryptMessage(
    LocalStorage.get(sharedLocalStorageKeys.privateKey),
    pic.password
  );

  const decryptedNote = pic.note
    ? await decryptMessageSymmetric(decryptedPassword, pic.note)
    : pic.note;
  const decryptedLinks = [];
  await asyncForEach(pic.links || [], async link => {
    const decryptedLinkName = await decryptMessageSymmetric(decryptedPassword, link.name);
    const decryptedLink = await decryptMessageSymmetric(decryptedPassword, link.link);
    decryptedLinks.push({ name: decryptedLinkName, link: decryptedLink });
  });

  return { ...pic, decryptedPassword, note: decryptedNote, links: decryptedLinks };
}
