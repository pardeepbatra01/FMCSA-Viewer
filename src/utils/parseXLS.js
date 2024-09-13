// src/utils/parseXLS.js
import * as XLSX from 'xlsx';

export const parseXLS = async (url) => {
  console.log("Fetching file from:", url);
  try {
    const response = await fetch(url, { cache: 'no-store' }); // Prevent caching issues
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    console.log("File fetched successfully:", arrayBuffer);
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log("File parsed successfully:", jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error fetching/parsing file:", error);
    throw error;
  }
};