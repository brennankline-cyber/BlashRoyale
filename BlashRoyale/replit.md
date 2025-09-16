# Overview

This is a 3D tower defense battle game called "Blash Croyale," inspired by Clash Royale. Built as a full-stack web application, it features real-time 3D gameplay using React Three Fiber for rendering, a comprehensive card-based combat system, and AI opponents. The game includes multiple phases (loading screen, main menu, battle arena, and shop), tower defense mechanics with destructible towers, unit spawning and combat, and a progression system with virtual currency.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a **React SPA architecture** with TypeScript and Vite as the build tool. The frontend is organized into a component-based structure with clear separation of concerns:

- **3D Rendering**: React Three Fiber (@react-three/fiber) with drei utilities for 3D scene management
- **State Management**: Zustand for lightweight, reactive state management across game phases
- **UI Components**: Radix UI primitives with Tailwind CSS for consistent, accessible interface components
- **Game Loop**: Custom hooks and stores managing real-time game updates at 10 FPS

## Backend Architecture  
The backend follows an **Express.js REST API pattern** with TypeScript:

- **Server Framework**: Express.js with custom middleware for request logging and error handling
- **Development Setup**: Vite integration for hot module replacement in development
- **Route Structure**: Modular route registration with API prefix (`/api`) for clear separation
- **Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage class)

## Data Storage
**Dual storage approach** supporting both development and production scenarios:

- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Centralized schema definitions in `/shared/schema.ts` using Drizzle's pgTable
- **Development Fallback**: In-memory storage implementation for rapid prototyping
- **Migration Support**: Drizzle Kit for database schema migrations

## Game System Architecture
**Component-based game architecture** with clear separation of game logic:

- **Game States**: Phase-based game flow (loading → menu → battle → shop)
- **Unit System**: Type-safe unit definitions with stats, behaviors, and combat mechanics  
- **Card System**: Deck-based unit spawning with cost management and cooldowns
- **AI System**: Simple AI opponent with elixir management and strategic unit placement
- **Combat Engine**: Real-time collision detection, targeting, and damage calculation

## External Dependencies

**Core Framework Dependencies**:
- React ecosystem (React 18, React Three Fiber, drei) for 3D rendering and UI
- Express.js with TypeScript for backend API development
- Vite for build tooling and development server with HMR

**Database and ORM**:
- PostgreSQL as the primary database (via DATABASE_URL environment variable)
- Neon Database serverless driver (@neondatabase/serverless) for cloud database connectivity
- Drizzle ORM for type-safe database operations and schema management

**UI and Styling**:
- Tailwind CSS for utility-first styling with custom design system
- Radix UI component primitives for accessible, unstyled UI building blocks
- Fontsource for web font management (Inter font family)

**Development Tools**:
- TypeScript for type safety across the full stack
- ESBuild for production bundling and optimization
- GLSL shader support via vite-plugin-glsl for advanced 3D effects

**Game Development**:
- Three.js (via React Three Fiber) for 3D graphics and WebGL rendering
- React Postprocessing for visual effects and post-processing pipelines
- Custom audio management system for game sounds and music

**Session Management**:
- Connect-pg-simple for PostgreSQL-based session storage
- Express sessions with secure cookie handling