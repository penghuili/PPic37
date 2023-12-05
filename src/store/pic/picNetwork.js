import apps from '../../shared/js/apps';
import asyncForEach from '../../shared/js/asyncForEach';
import {
  decryptMessage,
  decryptMessageSymmetric,
  encryptMessage,
  encryptMessageSymmetric,
} from '../../shared/js/encryption';
import generatePassword from '../../shared/js/generatePassword';
import { LocalStorage, sharedLocalStorageKeys } from '../../shared/js/LocalStorage';
import HTTP from '../../shared/react/HTTP';
import { CHUNK_SIZE, decryptFile, encryptFile } from './encryptFile';

async function fetchUrlsForUpload(count) {
  try {
    const { urls, fileId } = await HTTP.get(apps.file37.name, `/v1/upload-url?count=${count}`);

    return { data: { urls, fileId }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function fetchUrlsForDownload(fileId) {
  try {
    const { urls } = await HTTP.get(apps.file37.name, `/v1/download-url/${fileId}`);

    return { data: urls, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function uploadFile(file) {
  try {
    const count = Math.ceil(file.size / CHUNK_SIZE);
    const {
      data: { urls, fileId },
    } = await fetchUrlsForUpload(count);

    const password = generatePassword(20, true);

    await asyncForEach(urls, async (url, index) => {
      const chunk = file.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE);
      const encryptedChunk = await encryptFile(chunk, password);

      await fetch(url, {
        method: 'PUT',
        body: encryptedChunk,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
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
      count,
      mimeType: file.type,
      size: file.size,
    });
    return { data: { ...data, encryptedPassword, password }, error: null };
  } catch (error) {
    console.log('uploadFile error', error);
    return { data: null, error };
  }
}

export async function downloadFile(fileId) {
  try {
    const { data: urls } = await fetchUrlsForDownload(fileId);

    const fileMeta = await HTTP.get(apps.file37.name, `/v1/files/${fileId}`);
    const decryptedPassword = await decryptMessage(
      LocalStorage.get(sharedLocalStorageKeys.privateKey),
      fileMeta.password
    );

    const { writable, readable } = new TransformStream();
    const writer = writable.getWriter();
    await asyncForEach(urls, async url => {
      const buffer = await fetch(url).then(response => response.arrayBuffer());
      const chunk = new Uint8Array(buffer);
      const decryptedChunk = await decryptFile(chunk, decryptedPassword);
      writer.write(new Uint8Array(decryptedChunk));
    });

    writer.close();

    const blob = await new Response(readable).blob();

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
