# WiFi QR Code Frontend

Modern React application for managing WiFi QR codes. This application provides a user-friendly interface for creating, managing, and sharing WiFi QR codes.

## Features

- User authentication
- Create and manage WiFi QR codes
- Real-time QR code preview
- Responsive design
- Dark mode support
- Modern UI with glass morphism effects
- TypeScript support
- State management with Zustand
- Route protection

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Zustand
- React Router DOM
- Axios
- QRCode.react

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend repository)

## Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd wifi-qr-code-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the environment variables in `.env` file:
```
VITE_API_URL=http://localhost:5002
```

## Development

Run the development server:
```bash
npm run dev
```

The application will start on http://localhost:5173

## Build

Build the project:
```bash
npm run build
```

Preview the build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable components
│   └── layouts/    # Layout components
├── hooks/         # Custom hooks
├── pages/         # Page components
├── services/      # API services
├── store/         # State management
├── styles/        # Global styles
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## Features in Detail

### Authentication
- Login page with form validation
- Protected routes
- Token management
- Automatic token refresh

### QR Code Management
- Create new QR codes with:
  - Network name (label)
  - SSID
  - Password
  - Security type (WPA/WPA2, WEP, None)
  - Hidden network option
  - Description
- List all QR codes
- View QR code details
- Download QR codes
- Delete QR codes

### UI/UX
- Responsive design for all screen sizes
- Loading states
- Error handling
- Success notifications
- Smooth animations
- Glass morphism design
- Dark mode support

## State Management

The application uses Zustand for state management with the following stores:
- Auth Store: Handles user authentication and token management
- QR Code Store: Manages QR code data and operations

## API Integration

The frontend communicates with the backend API using Axios. All API calls are centralized in the services directory.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
