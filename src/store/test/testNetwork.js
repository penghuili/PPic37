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

export async function fetchItems() {
  try {
    const items = await HTTP.get('app', `/v1/items`);

    const decryptedItems = [];
    await asyncForEach(items, async item => {
      const decrypted = await decryptItemContent(item);
      decryptedItems.push(decrypted);
    });

    return { data: decryptedItems, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createItem({ title, note }) {
  try {
    const password = generatePassword(20, true);
    const { title: encryptedTitle, note: encryptedNote } = await encryptItemContent(
      { title, note },
      password
    );
    const encryptedPassword = await encryptMessage(
      LocalStorage.get(sharedLocalStorageKeys.publicKey),
      password
    );

    const data = await HTTP.post('app', `/v1/items`, {
      password: encryptedPassword,
      title: encryptedTitle,
      note: encryptedNote,
    });

    const decrypted = await decryptItemContent(data);

    return { data: decrypted, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateItem(decryptedPassword, itemId, { title, note, position }) {
  try {
    const { title: encryptedTitle, note: encryptedNote } = await encryptItemContent(
      { title, note },
      decryptedPassword
    );

    const page = await HTTP.put('app', `/v1/items/${itemId}`, {
      title: encryptedTitle,
      note: encryptedNote,
      position,
    });

    const decrypted = await decryptItemContent(page);

    return { data: decrypted, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteItem(itemId) {
  try {
    const data = await HTTP.delete('app', `/v1/items/${itemId}`);

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function encryptItemContent(data, decryptedPassword) {
  const { title, note } = data;

  const encryptedTitle = title ? await encryptMessageSymmetric(decryptedPassword, title) : title;
  const encryptedNote = note ? await encryptMessageSymmetric(decryptedPassword, note) : note;

  return {
    ...data,
    title: encryptedTitle,
    note: encryptedNote,
  };
}

async function decryptItemContent(data) {
  const { title, note, isPublic, password } = data;

  const privateKey = LocalStorage.get(sharedLocalStorageKeys.privateKey);
  const decryptedPassword = isPublic ? password : await decryptMessage(privateKey, password);
  const decryptedTitle = await decryptMessageSymmetric(decryptedPassword, title);
  const decryptedNote = note ? await decryptMessageSymmetric(decryptedPassword, note) : null;

  return {
    ...data,
    title: decryptedTitle,
    note: decryptedNote,
    decryptedPassword,
  };
}
