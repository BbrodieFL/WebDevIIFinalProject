# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.6.

## Prerequisites

Before running this project, ensure you have:
- Node.js version 18.19 or higher installed
- Angular CLI version 19.0.6
- MongoDB running locally on port 27017
- Backend server running on port 3000

To check your Node.js version:
```bash
node -v
```

To update Node.js using nvm:
```bash
nvm install 18.19
nvm use 18.19
```

## Installation

1. Install project dependencies:
```bash
npm install
```

2. Verify environment files:
- Ensure `/src/environments/environment.ts` exists
- Ensure `/src/environments/environment.development.ts` exists

## Running the Application

1. Start MongoDB:
```bash
mongosh
```

2. Start the backend server (in a new terminal):
```bash
cd ../backend
npm run dev
```

3. Start the frontend development server:
```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Environment Configuration

The application uses two environment files:
- `environment.ts` - Production configuration
- `environment.development.ts` - Development configuration

Make sure these files contain the correct API URLs and other environment-specific settings.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.