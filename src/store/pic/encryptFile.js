import { createMessage, decrypt, encrypt, readMessage } from 'openpgp';

import asyncForEach from '../../shared/js/asyncForEach';

export const CHUNK_SIZE = 1024 * 1024 * 10;

export async function encryptFile(fileFromInput, password) {
  const fileData = await fileFromInput.arrayBuffer();
  const binaryData = new Uint8Array(fileData);

  const message = await createMessage({ binary: binaryData });
  const encrypted = await encrypt({
    message,
    passwords: [password],
    format: 'binary',
  });

  return encrypted;
}

export async function decryptFile(fileFromServer, password) {
  const message = await readMessage({ binaryMessage: fileFromServer });
  const decrypted = await decrypt({
    message,
    passwords: [password],
    format: 'binary',
  });

  return decrypted.data;
}

export async function encryptAndUploadFileChunks(file, password, urls) {
  await asyncForEach(urls, async (url, index) => {
    const chunk = file.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE);
    const encryptedChunk = await encryptFile(chunk, password);

    const result = await fetch(url, {
      method: 'PUT',
      body: encryptedChunk,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
    console.log('result', result);
  });

  return {};
}
