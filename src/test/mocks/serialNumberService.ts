import { vi } from 'vitest';
import type { ProductInfo } from '@/services/serialNumberService';

// Deterministic ProductInfo data per model
const mockProductData: Record<string, ProductInfo> = {
  'max cr': {
    model: 'Max CR 2000',
    serialNumber: 'AMI123456789',
    purchaseDate: '2023-01-15',
    itemNumber: 'MAXCR-2000',
    itemDescription: 'Max CR 2000 Cash Register'
  },
  'maxcr': {
    model: 'Max CR 1500',
    serialNumber: 'AMI987654321',
    purchaseDate: '2022-11-20',
    itemNumber: 'MAXCR-1500',
    itemDescription: 'Max CR 1500 Cash Register'
  },
  'smartshopper': {
    model: 'SmartShopper Pro',
    serialNumber: 'AMI555666777',
    purchaseDate: '2023-03-10',
    itemNumber: 'SS-PRO-001',
    itemDescription: 'SmartShopper Pro Self-Checkout'
  },
  'smart shopper': {
    model: 'SmartShopper Basic',
    serialNumber: 'AMI111222333',
    purchaseDate: '2023-02-05',
    itemNumber: 'SS-BASIC-001',
    itemDescription: 'SmartShopper Basic Self-Checkout'
  },
  'valueshopper': {
    model: 'ValueShopper Lite',
    serialNumber: 'AMI444555666',
    purchaseDate: '2022-12-01',
    itemNumber: 'VS-LITE-001',
    itemDescription: 'ValueShopper Lite Self-Checkout'
  },
  'value shopper': {
    model: 'ValueShopper Standard',
    serialNumber: 'AMI777888999',
    purchaseDate: '2023-04-12',
    itemNumber: 'VS-STD-001',
    itemDescription: 'ValueShopper Standard Self-Checkout'
  },
  'vista': {
    model: 'Vista Point of Sale',
    serialNumber: 'AMI333444555',
    purchaseDate: '2023-01-30',
    itemNumber: 'VISTA-POS-001',
    itemDescription: 'Vista Point of Sale System'
  },
  'general': {
    model: 'General Product',
    serialNumber: 'AMI999000111',
    purchaseDate: '2023-05-01',
    itemNumber: 'GEN-001',
    itemDescription: 'General AMI Product'
  }
};

// Mock implementation functions
let mockBehavior: 'success' | 'error' = 'success';
let selectedModel = 'general';

const mockLookupSerialNumber = vi.fn().mockImplementation(async (serialNumber: string): Promise<ProductInfo | null> => {
  if (mockBehavior === 'error') {
    throw new Error('Serial number lookup failed');
  }
  
  const productInfo = mockProductData[selectedModel];
  if (!productInfo) {
    return null;
  }
  
  // Return a copy with the actual serial number used in the lookup
  return {
    ...productInfo,
    serialNumber: serialNumber.toLowerCase().startsWith('ami') ? serialNumber : `AMI${serialNumber}`
  };
});

const mockDetermineFlowFromModel = vi.fn().mockImplementation((model: string) => {
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
});

// Utility functions for test control
export const selectSuccess = (model: keyof typeof mockProductData = 'general') => {
  mockBehavior = 'success';
  selectedModel = model;
  mockLookupSerialNumber.mockClear();
  mockDetermineFlowFromModel.mockClear();
};

export const selectFailure = () => {
  mockBehavior = 'error';
  mockLookupSerialNumber.mockClear();
  mockDetermineFlowFromModel.mockClear();
};

// Mock the entire module
vi.mock('@/services/serialNumberService', () => ({
  lookupSerialNumber: mockLookupSerialNumber,
  determineFlowFromModel: mockDetermineFlowFromModel
}));

// Export mocks for direct access in tests
export const mockSerialNumberService = {
  lookupSerialNumber: mockLookupSerialNumber,
  determineFlowFromModel: mockDetermineFlowFromModel
};

// Export mock data for test assertions
export { mockProductData };