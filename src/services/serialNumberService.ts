
import { FlowType } from '@/hooks/useConversationFlow';

export interface ProductInfo {
  model: string;
  serialNumber: string;
  purchaseDate?: string;
  itemNumber?: string;
  itemDescription?: string;
}

// Format serial number according to NetSuite requirements
const formatSerialNumber = (userInput: string): string => {
  const cleanInput = userInput.trim();
  
  // Check if already starts with "AMI" (case-insensitive)
  if (cleanInput.toLowerCase().startsWith('ami')) {
    // Remove "ami" prefix and re-add as "AMI"
    const core_sn_part = cleanInput.substring(3);
    return `AMI${core_sn_part}`;
  }
  
  // If doesn't start with "ami", add "AMI" prefix
  return `AMI${cleanInput}`;
};

export const lookupSerialNumber = async (serialNumber: string): Promise<ProductInfo | null> => {
  try {
    const formattedSerialNumber = formatSerialNumber(serialNumber);
    console.log('Looking up serial number:', formattedSerialNumber);
    
    const response = await fetch(
      `/api/netsuite?script=6223&deploy=1&compid=4086366&ns-at=AAEJ7tMQZmDLpO0msvndzhyIbhPPdD7U3fcHROrep1qJ6u8nu-w&snar=${formattedSerialNumber}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    console.log('NetSuite response status:', response.status);

    if (response.ok) {
      const responseText = await response.text();
      console.log('NetSuite response data:', responseText);
      
      // Check if the response is "Invalid SNAR" (serial number not found)
      if (responseText.trim() === 'Invalid SNAR') {
        console.log('Serial number not found in NetSuite');
        return null;
      }
      
      try {
        const data = JSON.parse(responseText);
        // NetSuite returns: {"name":"AMI0380224","purchdate":"2/5/2025","model":"Smart Shopper","itemnumber":"Kroger SS LB IoT","itemdescription":"Amigo Kroger SmartShopper Lithium w/ IoT"}
        return {
          model: data.model,
          serialNumber: data.name, // NetSuite returns the full serial in "name" field
          purchaseDate: data.purchdate,
          itemNumber: data.itemnumber,
          itemDescription: data.itemdescription
        };
      } catch (parseError) {
        console.error('Error parsing NetSuite response as JSON:', parseError);
        console.log('Response was not valid JSON:', responseText);
        return null;
      }
    }
    
    console.log('NetSuite request failed with status:', response.status);
    return null;
  } catch (error) {
    console.error('Error looking up serial number:', error);
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
