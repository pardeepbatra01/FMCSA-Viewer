/* eslint-disable no-restricted-globals */

import { parseXLS } from './utils/parseXLS';

self.onmessage = async () => {
  try {
    const parsedData = await parseXLS('/FMSCA_records.xls');
    const chunkSize = Math.ceil(parsedData.length / 10);
    for (let i = 0; i < parsedData.length; i += chunkSize) {
      const chunk = parsedData.slice(i, i + chunkSize);
      self.postMessage({ progress: ((i + chunkSize) / parsedData.length) * 100, data: chunk });
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay for processing
    }
    self.postMessage({ progress: 100, data: parsedData });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};

/* eslint-enable no-restricted-globals */