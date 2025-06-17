# Restaurant Menu Management App

A React-powered restaurant menu management application integrating with Toast API to provide comprehensive menu exploration and order management features.

## Features

- **Real-time Menu Loading**: Fetches authentic menu data from Toast API with 5-minute caching
- **Order Management**: Add items to cart, modify quantities, and submit orders
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Comprehensive error management with user-friendly messages
- **Performance Optimized**: Modular component architecture with efficient caching

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **API Integration**: Toast API with OAuth 2.0
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation

## Prerequisites

- Node.js 18+
- Toast API credentials (sandbox environment)
- Restaurant GUID from Toast

## Environment Variables

Create a `.env` file in the root directory:

```env
RESTAURANT_GUID=your_restaurant_guid_here
TOAST_CLIENT_ID=your_client_id_here
TOAST_CLIENT_SECRET=your_client_secret_here
```

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd restaurant-menu-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see above)

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and API clients
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express server
│   ├── routes.ts           # API route definitions
│   ├── toast-client.ts     # Toast API integration
│   ├── menu-management.ts  # Menu data processing
│   └── storage.ts          # In-memory data storage
├── shared/                 # Shared TypeScript schemas
└── package.json
```

## API Integration

The application integrates with Toast's sandbox API:
- **Base URL**: `https://ws-sandbox-api.eng.toasttab.com`
- **Authentication**: OAuth 2.0 client credentials flow
- **Menu Data**: Fetches from Base Price Menu with real pricing

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style

- TypeScript for type safety
- ESLint + Prettier for code formatting
- Modular component architecture
- Custom hooks for business logic

## Performance Features

- **Menu Caching**: Server-side caching with 5-minute TTL
- **Code Splitting**: Modular components for better loading
- **Optimized Bundle**: Removed unused dependencies (~79 packages)
- **Error Boundaries**: Graceful error handling

## Architecture Decisions

- **Modular Components**: Separated OrderManager and ErrorHandler for reusability
- **In-Memory Storage**: Fast development with MemStorage interface
- **Single Port**: Vite serves both frontend and backend
- **Type Safety**: Shared schemas between frontend and backend

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support or questions about Toast API integration, please refer to the [Toast API Documentation](https://doc.toasttab.com/) or create an issue in this repository.