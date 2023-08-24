import { createMessage, decrypt, encrypt, readMessage } from 'openpgp';

export async function encryptFile(fileFromInput, password) {
  const fileData = await fileFromInput.arrayBuffer();
  const binaryData = new Uint8Array(fileData)

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
