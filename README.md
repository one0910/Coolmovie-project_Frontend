# Intruction

This project is a personal side project aimed at building a full-stack movie ticketing system from scratch. It serves as a platform for me to explore and implement various front-end and back-end technologies. Key objectives include:

1. Developing a robust and scalable ticketing system with both front-end and back-end components.
2. Planning and evaluating the overall system architecture, including technology selection.
3. Integrating popular and cutting-edge technologies into the application.

## Demo Site

#### Frontend Stage:

> https://coolmovie-clinet.koijinoblog.com/ > ![圖片](https://github.com/user-attachments/assets/e7e1d209-4fac-4e8b-bed7-80a3f8fdcb7c)

#### Backagend Stage(Management Page)

> https://coolmovie-clinet.koijinoblog.com/viewmode/a123456789

- `Login Account` : viewmode@gmail.com
- `Login Password `: a123456789
  ![圖片](https://github.com/user-attachments/assets/205f462d-727f-4f74-80c4-27fbd931e4bc)

## Website Features

1. Movie ticket booking system
2. Seat selection
3. Membership system
4. Backend management and login
5. ECPay payment support
6. Multiple language support

### Technologies Used (Frontend)

- Frontstage - React + Typescript + Bootstrap + styled-components+ SocketI.O + Google Login + ECpay + Internationalization
- Backstage - Redux and Redux Toolkit + RTK-Query + Ant Design + Internationalization

## Directory Structure

- `.public`: Public static files
  - `images`: Stores images (e.g., logo, icons)
  - `locales`: Stores localization files for multiple languages (e.g., English, Traditional Chinese)
- `src`: Source code
  - `api`: Contains backend API endpoints
  - `assets`: Static assets
    - `scss`: SCSS files for components, pages, and global styles
  - `components`: Reusable components
  - `helper`: Helper functions for language translation
  - `includes`: Contains files for application initialization
  - `interface`: TypeScript interface definitions
  - `pages`: Contains page components (frontend and backend)
  - `services`: RTK-Query services for RESTful API interactions
  - `store`: Redux store configuration
    - `common`: Common data (e.g., device detection, error notifications, language detection, general notifications)
  - `utilities`: Utility functions (e.g., date formatting, API request interception)
- `.env.development`: Environment variables for development
- `.env.production`: Environment variables for production
- `.eslintrc`: ESLint configuration
- `.gitignore`: Git ignore file
- `package-lock.json`: Package-lock file
- `package.json`: Project information
- `.README.md`: Project README
- `.tsconfig.json`: TypeScript configuration

## Project Setup

- Enter node -v in the terminal to ensure the Node version is v14.x or above.
- Enter npm install in the terminal to install the dependencies.
