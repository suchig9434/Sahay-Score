import { VALIDATION_PATTERNS, FILE_CONFIG, API_BASE_URL } from './constants';

// Validation utilities
export const validateAadhar = (aadhar) => {
  const cleaned = aadhar.replace(/\s/g, '');
  if (!VALIDATION_PATTERNS.AADHAR.test(aadhar)) {
    return { valid: false, error: 'Aadhar must be 12 digits (e.g., 1234 5678 9012)' };
  }
  if (cleaned.length !== 12) {
    return { valid: false, error: 'Aadhar must contain exactly 12 digits' };
  }
  return { valid: true };
};

export const validatePhone = (phone) => {
  const cleaned = phone.replace(/[\s\-\+]/g, '');
  if (!VALIDATION_PATTERNS.PHONE.test(cleaned) && !VALIDATION_PATTERNS.PHONE_WITH_CODE.test(phone)) {
    return { valid: false, error: 'Enter a valid 10-digit Indian mobile number' };
  }
  return { valid: true };
};

export const validateFile = (file) => {
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!FILE_CONFIG.ACCEPTED_TYPES.includes(extension)) {
    return { 
      valid: false, 
      error: `File type not allowed. Accept: ${FILE_CONFIG.ACCEPTED_TYPES.join(', ')}` 
    };
  }
  
  if (file.size > FILE_CONFIG.MAX_SIZE_BYTES) {
    return { 
      valid: false, 
      error: `File size exceeds ${FILE_CONFIG.MAX_SIZE_BYTES / 1024 / 1024}MB limit` 
    };
  }
  
  return { valid: true };
};

// Safe number parser
export const parseNumber = (value, defaultValue = 0) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
};

// API utilities
export const api = {
  async fetchApplications() {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  async fetchApplication(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  },

  async createApplication(application) {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application)
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  async updateApplication(id, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  },

  async fetchStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};
