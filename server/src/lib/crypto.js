import CryptoJS from "crypto-js";

export const generateUniqueId = (senderId, receiverId) => {
  if (!senderId || !receiverId) return;
  const sortedIds = [senderId, receiverId].sort().join("_");
  return CryptoJS.SHA256(sortedIds).toString(CryptoJS.enc.Hex);
};

export const encryptData = (data, secretKey) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const decryptData = (ciphertext, secretKey) => {
  if (ciphertext == null || secretKey == null) return;

  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
