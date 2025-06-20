# Amigo Mobility Virtual Assistant Chat Widget

A sophisticated, multi-state conversational interface designed to provide support and information to Amigo Mobility customers. The widget seamlessly transitions through four distinct states, creating an intuitive and engaging user experience.

## Project Overview

The Amigo Mobility virtual assistant embodies the company's core philosophy of treating "customers & coworkers like family" and helps achieve their mission of "Improving Lives Through Mobility®". The interface serves as a helpful, knowledgeable "first friend" for users seeking support with Amigo products and services.

## Features

### Four Interface States
1. **The Launcher (Minimized)**: Circular floating action button with "Ask Us" or "Chat Now" label
2. **The Invitation (Horizontal Strip)**: Expandable welcome prompt with pre-defined suggestion buttons
3. **The Companion (Vertical Sidebar)**: Full conversation interface docked to the right edge
4. **The Immersive (Centered Modal)**: Large, centered modal with enhanced focus and space

### Key Capabilities
- Smooth transitions between all interface states
- Brand-consistent design using official Amigo Mobility colors and typography
- Responsive design that works across all devices
- Conversation flow management for different user types (Value Shoppers, Smart Shoppers, etc.)
- Serial number lookup and product support integration
- Professional loading states with skeleton animations

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: React hooks and custom conversation flow logic
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## Design System

### Brand Colors
- **Amigo Blue**: #0070A8
- **Navy Blue**: #26405A  
- **Amigo Gray**: #EFEEEE, #DEDEDE
- **Standard**: #FFFFFF (white), #000000 (black)

### Typography
- **Headers**: Oswald Bold (ALL CAPS)
- **Sub-headers**: Montserrat ExtraBold
- **Body**: Montserrat Regular (12pt minimum)

## Getting Started

### Prerequisites
- Node.js (recommended: install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chameleon-chat-widget-main
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the local server URL (typically `http://localhost:5173`)

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatWidget.tsx   # Main chat widget component
│   ├── chat/           # Chat-specific components
│   └── ui/             # shadcn/ui components
├── data/               # Conversation flows and data
│   ├── conversationFlow.ts
│   ├── valueShopperFlow.ts
│   └── contactAgentFlow.ts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── services/           # API and external services
```

## Conversation Flows

The widget includes sophisticated conversation flows for different user types:
- **Value Shoppers**: Price-focused customers seeking basic information
- **Smart Shoppers**: Research-oriented users wanting detailed specifications
- **Contact Agent**: Direct connection to human support
- **End Conversation**: Graceful conversation termination

## Development Guidelines

### Terminology
- Use "Amigo cart" or "power-operated vehicle (POV)"
- Avoid the term "scooters"
- Maintain professional, family-friendly tone

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Consistent component structure
- Responsive design principles
- Accessibility best practices

## Contributing

1. Follow the established code style and TypeScript patterns
2. Ensure all components are responsive and accessible
3. Test across different interface states
4. Maintain brand consistency in all UI elements
5. Document any new conversation flows or major features

## Troubleshooting

### Common Development Issues

If you encounter odd build errors or unexpected behavior during development, try these steps:

1. **Clean build artifacts and caches**:
   ```bash
   npm run clean
   ```
   This removes Vite cache, node_modules cache, and build outputs that may be causing conflicts.

2. **Port conflicts**:
   If you see port-related errors or suspect multiple dev servers are running, kill any stray Node.js processes:
   ```bash
   # On Windows
   taskkill /f /im node.exe
   
   # On macOS/Linux
   pkill node
   ```

3. **Prevent accidental dual servers**:
   Always use the strict port mode to avoid confusion from multiple dev servers:
   ```bash
   npm run dev:strict
   ```
   This ensures Vite fails loudly when port 8080 is occupied instead of auto-incrementing to a new port.

## License

This project is proprietary to Amigo Mobility and is not licensed for public use.
