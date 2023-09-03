import CryptoJS from 'crypto-js';

const secretKey = process.env.AES_SECRET_KEY || 'a29503834cc148313ded41b5b25a837e26381d29ed5e50da9e7723d48cd8ee34';

export const encryptData = (data: string) => {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
}

export const decryptData = (encryptedData: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export const setMachineIdLS = (machineId: string) => {
    localStorage.setItem('machineId', encryptData(machineId));
}

export const checkMachineIdLS = (encryptedMachineId: string) => {
    // const encryptedMachineId = localStorage.getItem('machineId');
    // if (!encryptedMachineId) {
    //     return false;
    // }
    const machineId = decryptData(encryptedMachineId);
    return machineId === process.env.NEXT_PUBLIC_MACHINE_ID;
}