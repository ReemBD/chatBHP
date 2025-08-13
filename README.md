# ChatBHP - Lord of the Chats

<div align="center">
  <h3>✨ Realm of Digital Conversations ✨</h3>
  <p><em>One chat to rule them all, one chat to find them, one chat to bring them all and in the darkness bind them</em></p>
</div>

A mystical, Lord of the Rings themed real-time chat application built with modern web technologies. Experience the magic of Middle-earth through digital conversations with a beautifully crafted UI featuring golden gradients and epic styling.

## 🚀 Quick Start

### Development

1. **Start the client (Angular frontend):**
   ```bash
   npx nx serve chatBHP
   ```

2. **Start the server (NestJS backend):**
   ```bash
   npx nx serve chatBHP-server
   ```

3. **Open your browser** and navigate to the client URL (typically `http://localhost:4200`)

## 🛠️ Tech Stack

### Frontend
- **Angular 16** - Modern reactive framework with signals
- **Tailwind CSS** - Utility-first styling with custom Lord of the Rings theme
- **Socket.io** - Real-time communication
- **Nx Monorepo** - Scalable workspace architecture

### Backend
- **NestJS** - Progressive Node.js framework
- **Socket.io** - WebSocket implementation
- **OpenAI Integration** - AI-powered chat responses

### Key Features
- 🎨 **Lord of the Rings Themed UI** - Golden gradients and mystical styling
- 💬 **Real-time Chat** - Instant messaging with WebSocket
- 🤖 **AI Integration** - Intelligent responses powered by OpenAI
- 📱 **Responsive Design** - Works on all devices
- 🎯 **Modern Angular** - Using latest features like signals and control flow

## 🎨 Theme

The application features a carefully crafted Lord of the Rings aesthetic:
- Golden gradient text effects
- Themed scrollbars with amber and orange colors
- Middle-earth inspired color palette
- Epic typography and styling

## 📁 Project Structure

```
chatBHP/
├── apps/
│   ├── chatBHP/          # Angular frontend
│   └── chatBHP-server/   # NestJS backend
├── libs/                 # Shared libraries
│   ├── chat/            # Chat feature components
│   ├── core/            # Core services and utilities
│   └── ui/              # Reusable UI components
```

## 🔧 Available Commands

- `npx nx serve chatBHP` - Start frontend dev server
- `npx nx serve chatBHP-server` - Start backend dev server
- `npx nx build chatBHP` - Build frontend for production
- `npx nx build chatBHP-server` - Build backend for production
- `npx nx test chatBHP` - Run frontend tests
- `npx nx test chatBHP-server` - Run backend tests

---

<div align="center">
  <p><em>"All we have to decide is what to do with the time that is given us."</em> - Gandalf</p>
</div>
