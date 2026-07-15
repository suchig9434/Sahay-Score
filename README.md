# SahayScore Backend API

This is the backend API for the SahayScore application, an AI-powered dual credit scoring system for NBCFDC.

## Getting Started

### Prerequisites
- Node.js v14+
- npm

### Installation
```bash
cd backend
npm install
```

### Running the Server
```bash
npm run dev
```

The server will start on http://localhost:5000

## API Endpoints

### Applications

- `GET /api/applications` - Get all applications (supports query params: status, search)
- `GET /api/applications/:id` - Get a specific application by ID
- `POST /api/applications` - Create a new application
- `PATCH /api/applications/:id` - Update application status
- `DELETE /api/applications/:id` - Delete an application

### Statistics

- `GET /api/stats` - Get application statistics
- `GET /api/score-distribution` - Get score distribution data

## Data Model

### Application
```json
{
  "id": "SHS001",
  "name": "Ramesh Kumar",
  "repaymentScore": 420,
  "needScore": 380,
  "compositeScore": 800,
  "status": "approved",
  "amount": 50000,
  "date": "2025-01-15",
  "category": "Repeat Borrower",
  "electricityBill": 1200,
  "mobileRecharge": 200,
  "previousLoans": 3,
  "businessIncome": 75000,
  "familySize": 4,
  "classification": "High Need + Good Repayment"
}
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Project Structure

```
backend/
├── controllers/
│   └── applicationController.js
├── middleware/
│   ├── errorHandler.js
│   └── logger.js
├── routes/
│   └── applicationRoutes.js
├── .env
├── package.json
└── server.js
```