// SahayScore Configuration Constants

export const SCORING_WEIGHTS = {
  // Repayment Score Components (max 500)
  PREVIOUS_LOAN_MULTIPLIER: 80,
  PREVIOUS_LOAN_MAX: 200,
  BUSINESS_INCOME_DIVISOR: 1000,
  BUSINESS_INCOME_MULTIPLIER: 3,
  BUSINESS_INCOME_MAX: 150,
  BASE_REPAYMENT_SCORE: 150,
  MAX_REPAYMENT_SCORE: 500,

  // Need Score Components (max 500)
  ELECTRICITY_BASE: 200,
  ELECTRICITY_DIVISOR: 20,
  MOBILE_BASE: 150,
  MOBILE_DIVISOR: 5,
  UTILITY_BASE: 150,
  UTILITY_DIVISOR: 10,
  MAX_NEED_SCORE: 500,

  // Composite Score
  MAX_COMPOSITE_SCORE: 1000
};

export const CLASSIFICATION_THRESHOLDS = {
  HIGH_REPAYMENT_THRESHOLD: 350,
  HIGH_NEED_THRESHOLD: 300,
  LOW_REPAYMENT_THRESHOLD: 250,
  LOW_NEED_THRESHOLD: 200
};

export const LOAN_CONFIG = {
  INTEREST_RATE: "4% APR",
  PROCESSING_TIME: "Same Day",
  MIN_LOAN_AMOUNT: 1000,
  MAX_LOAN_AMOUNT: 500000,
  FILE_SIZE_LIMIT_MB: 5,
  MAX_FILES: 6
};

export const FILE_CONFIG = {
  ACCEPTED_TYPES: ['.pdf', '.jpg', '.jpeg', '.png'],
  ACCEPTED_MIME_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  MAX_SIZE_BYTES: 5 * 1024 * 1024 // 5MB
};

export const VALIDATION_PATTERNS = {
  AADHAR: /^\d{4}\s?\d{4}\s?\d{4}$/,
  PHONE: /^[6-9]\d{9}$/,
  PHONE_WITH_CODE: /^(\+91)?[6-9]\d{9}$/
};

export const API_BASE_URL = 'http://localhost:5000/api';

export const STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending',
  REJECTED: 'rejected'
};
