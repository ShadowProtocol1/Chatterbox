# Chatterbox

Chatterbox is a real-time chat application that allows users to communicate via direct messages and channels, supporting file sharing and a customizable UI theme (light/dark mode). The project is built with a modern React frontend using Vite, Zustand for state management, and socket.io for real-time communication.

## Features

- **Real-time Messaging:** Instant messaging via direct messages and channels using socket.io.
- **File Sharing:** Upload and download files within chats.
- **Authentication:** User sign up, login, and profile management.
- **Contacts:** Search, add, and manage contacts for direct messaging.
- **Channel Support:** Create and manage chat channels (group conversations).
- **Custom Theme:** Toggle between light and dark modes.
- **Responsive UI:** Built with modern React and UI libraries.

## Tech Stack

- **Frontend:** React (with Vite), Zustand, socket.io-client, React Router, Radix UI, ESLint, emoji-picker-react
- **Backend:** Node.js, Express, socket.io, MongoDB (via Mongoose)
- **Other:** File uploads with Multer (server), Moment.js, Vercel deployment

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/ShadowProtocol1/Chatterbox.git
cd Chatterbox
```

#### 2. Install dependencies

**Client:**
```bash
cd client
npm install
```

**Server:**
```bash
cd ../server
npm install
```

#### 3. Environment Variables

Create `.env` files in both `client` and `server` directories.

**Client (`client/.env`):**
```
VITE_SERVER_URL=http://localhost:5000
```

**Server (`server/.env`):**
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

#### 4. Running the app

**Start the server:**
```bash
cd server
npm run dev
```

**Start the client:**
```bash
cd ../client
npm run dev
```

The client will run on [http://localhost:5173](http://localhost:5173) (or as configured), and connect to the backend server.

## Usage

1. Open the client in your browser.
2. Sign up and set up your profile.
3. Add contacts, start direct messages, or join channels.
4. Share messages and files in real-time.

## Deployment

The project is deployed at: [https://chatterbox-theta-eight.vercel.app](https://chatterbox-theta-eight.vercel.app)

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please open issues or pull requests to discuss improvements, bug fixes, or new features.
