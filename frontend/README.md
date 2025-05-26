# Frontend Application

This is the frontend application for the candidate management system. It is built with React, TypeScript, Redux Toolkit, and Tailwind CSS.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:
```
REACT_APP_API_URL=http://localhost:3001/api
```

## Development

To start the development server:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Features

- View list of candidates
- Add new candidates
- Edit existing candidates
- Delete candidates
- Upload and view candidate CVs
- Toast notifications for actions
- Form validation
- Responsive design

## Technologies Used

- React
- TypeScript
- Redux Toolkit
- React Hook Form
- Zod
- Tailwind CSS
- Radix UI
- Axios
