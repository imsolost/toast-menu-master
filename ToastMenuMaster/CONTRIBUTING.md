# Contributing to Restaurant Menu Management App

Thank you for considering contributing to this project! This document outlines the process for contributing and the standards we follow.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/restaurant-menu-app.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Set up the development environment (see README.md)

## Development Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure your Toast API credentials
3. Start the development server: `npm run dev`

## Code Standards

### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use shared schemas from `shared/schema.ts`

### React Components
- Use functional components with hooks
- Implement proper error boundaries
- Follow the modular component architecture
- Use React Hook Form for form handling

### Styling
- Use Tailwind CSS for styling
- Follow the existing design system
- Use Radix UI components when available
- Maintain responsive design principles

### API Integration
- Use the existing Toast API client
- Implement proper error handling
- Follow the caching patterns established
- Never use mock data - only authentic API responses

## Project Structure Guidelines

- `client/src/components/` - Reusable UI components
- `client/src/pages/` - Page-level components
- `client/src/lib/` - Utilities and API clients
- `server/` - Backend API and business logic
- `shared/` - Shared TypeScript schemas

## Commit Guidelines

- Use clear, descriptive commit messages
- Follow conventional commits format: `type: description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat: add order confirmation modal
fix: resolve menu caching issue
docs: update API integration guide
```

## Pull Request Process

1. Ensure your code follows the project standards
2. Add tests for new functionality
3. Update documentation as needed
4. Ensure all existing tests pass
5. Submit a pull request with a clear description

## Testing

- Test all Toast API integrations with real data
- Verify responsive design on different screen sizes
- Test error handling scenarios
- Ensure order flow works end-to-end

## Performance Considerations

- Maintain the existing caching strategies
- Use React Query for data fetching
- Optimize component re-renders
- Keep bundle size minimal

## Questions?

If you have questions about contributing, please open an issue or reach out to the maintainers.

Thank you for your contributions!