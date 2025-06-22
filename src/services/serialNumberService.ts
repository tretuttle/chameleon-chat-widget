import { FlowType } from '@/hooks/useChat';
import * as logger from '@/lib/logger';

export interface ProductInfo {
  model: string;
  serialNumber: string;
  purchaseDate?: string;
  itemNumber?: string;
  itemDescription?: string;
}

// Format serial number according to the requirements
const formatSerialNumber = (userInput: string): string => {
  const cleanInput = userInput.trim();
  let coreSNPart = '';
  
  // Check if userInput (case-insensitive) starts with "ami"
  if (cleanInput.toLowerCase().startsWith('ami')) {
    // Remove the "ami" prefix
    coreSNPart = cleanInput.substring(3);
  } else {
    // Use the entire input as core part
    coreSNPart = cleanInput;
  }
  
  // Final formatted serial number is "AMI" + core_sn_part
  return 'AMI' + coreSNPart;
};

export const lookupSerialNumber = async (serialNumber: string): Promise<ProductInfo | null> => {
  try {
    // Format the serial number according to requirements
    const formattedSerialNumber = formatSerialNumber(serialNumber);
    
    // NetSuite direct URL
    const netsuiteUrl = `https://4086366.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=6223&deploy=1&compid=4086366&ns-at=AAEJ7tMQZmDLpO0msvndzhyIbhPPdD7U3fcHROrep1qJ6u8nu-w&snar=${formattedSerialNumber}`;
    
    // Use Vite proxy in development, CORS proxy in production
    const isDevelopment = import.meta.env.DEV;
    const apiUrl = isDevelopment 
      ? `/api/netsuite/app/site/hosting/scriptlet.nl?script=6223&deploy=1&compid=4086366&ns-at=AAEJ7tMQZmDLpO0msvndzhyIbhPPdD7U3fcHROrep1qJ6u8nu-w&snar=${formattedSerialNumber}`
      : `https://api.allorigins.win/get?url=${encodeURIComponent(netsuiteUrl)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (response.ok) {
      let data;
      
      if (isDevelopment) {
        // Direct JSON response in development
        data = await response.json();
      } else {
        // AllOrigins wraps the response in a "contents" field
        const proxyResponse = await response.json();
        data = JSON.parse(proxyResponse.contents);
      }
      
      // Extract the required fields from the response
      return {
        model: data.model || '',
        serialNumber: data.name || formattedSerialNumber,
        purchaseDate: data.purchdate || '',
        itemNumber: data.itemnumber || '',
        itemDescription: data.itemdescription || ''
      };
    } else {
      return null;
    }
    
  } catch (error) {
    logger.error('Error looking up serial number:', error);
    throw error;
  }
};

export const determineFlowFromModel = (model: string): FlowType => {
  const modelLower = model.toLowerCase();
  
  if (modelLower.includes('max cr') || modelLower.includes('maxcr')) {
    return 'maxCR';
  } else if (modelLower.includes('smartshopper') || modelLower.includes('smart shopper')) {
    return 'smartShopper';
  } else if (modelLower.includes('valueshopper') || modelLower.includes('value shopper')) {
    return 'valueShopper';
  } else if (modelLower.includes('vista')) {
    return 'vista';
  }
  
  return 'general';
};
