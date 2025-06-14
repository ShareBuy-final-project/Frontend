# ShareBuy Maintenance Guide

This guide is for developers and system administrators responsible for maintaining the ShareBuy platform. It covers setup, configuration, deployment, monitoring, troubleshooting, and best practices.

## Table of Contents

1. System Overview
2. Frontend (React Native App)
3. Backend (Microservices Architecture)
   - 3.1 API Gateway
   - 3.2 Authentication Service
   - 3.3 User Service
   - 3.4 Group Service
   - 3.5 Payment Service
   - 3.6 Chat Service
   - 3.7 Recommendations Service
4. Database Management
5. Monitoring & Logging
6. Troubleshooting
7. Updating & Upgrading
8. Security
9. Backup & Recovery
10. Contact & Support

---

## 1. System Overview

ShareBuy is a full-stack application with a React Native frontend and a Node.js backend composed of several microservices. The backend is orchestrated using Docker Compose for easy deployment and scalability. The system uses PostgreSQL as its main database and supports secure communication via SSL certificates.

## 2. Frontend (React Native App)

- **Location:** `Frontend/`
- **Technology:** React Native (JavaScript), Expo CLI, React Navigation, Stripe for payments, Socket.IO for real-time chat.
- **Structure:**
  - `app/`: Main screens, navigation, and business logic.
  - `components/`: Reusable UI components (e.g., Card, InputField, SearchBar).
  - `apiCalls/`: API wrappers for backend communication (auth, chat, group, payment, etc.).
  - `context/`: Context providers (e.g., SocketContext for real-time features).
  - `assets/`: Images and icons.
  - `constants/`: Theme and style constants.
  - `utils/`: Utility functions (e.g., token management).
- **Running Locally:**
  1. Run `npm install` to install dependencies.
  2. Start with `npx expo start`.
  3. Use Expo Go app or an emulator to test.
- **Building APK:**
  1. Switch to the `build-apk` branch and merge latest changes.
  2. Run Gradle commands in `android/` to build the APK.
  3. Distribute the APK as needed.
- **Key Features:**
  - User registration and login (regular and business users).
  - Deal browsing, group joining/creation, and chat.
  - Secure payments via Stripe.
  - Real-time notifications and chat using Socket.IO.
  - Personalized recommendations.
- **Maintenance Tips:**
  - Keep dependencies updated.
  - Test UI on Android after new updates.
  - Use Expo for rapid development and debugging.
  - Monitor API endpoints for changes in backend contracts.

## 3. Backend (Microservices Architecture)

- **Location:** `Backend/`
- **Technology:** Node.js, Express, Sequelize (ORM), PostgreSQL, Docker Compose, Socket.IO, TensorFlow.js (for recommendations).
- **Structure:**
  - `ApiGateway/`: Central entry point for all API requests, proxies to microservices.
  - `services/`: Contains all microservices:
    - `Authentication/`: Handles login, token issuance, and validation.
    - `User/`: Manages user and business registration, user data.
    - `Group/`: Manages deals/groups, joining/leaving, and group history.
    - `Payment/`: Handles payment intents, Stripe integration, and business onboarding.
    - `Chat/`: Real-time group chat using Socket.IO.
    - `Recommendations/`: AI-driven recommendations using user/group embeddings.
  - `config/models/`: Sequelize models for all entities.
  - `sslKeys/`: SSL certificates for secure communication.
  - `scripts/`: Database and data initialization scripts.

### 3.1 API Gateway

- **File:** `Backend/ApiGateway/app.js`
- **Role:** Receives all client requests and proxies them to the appropriate microservice using `http-proxy-middleware`.
- **Features:**
  - Centralized logging of requests.
  - Handles CORS and body parsing.
  - Can be extended for authentication, rate limiting, etc.
- **Maintenance Tips:**
  - Monitor logs for failed requests.
  - Update proxy targets if service ports change.

### 3.2 Authentication Service

- **Location:** `Backend/services/Authentication/`
- **Role:** Handles user login, token issuance (JWT), token validation, and refresh tokens.
- **Endpoints:**
  - `/auth/login`: User login, returns access and refresh tokens.
  - `/auth/validate-token`: Validates JWT and returns user info.
  - `/auth/token`: Issues new access token using refresh token.
- **Maintenance Tips:**
  - Rotate JWT secrets regularly.
  - Monitor for failed login attempts.
  - Ensure secure storage of refresh tokens.

### 3.3 User Service

- **Location:** `Backend/services/User/`
- **Role:** Manages user and business registration, user profile data.
- **Endpoints:**
  - `/register`: Register a new user.
  - `/registerBusiness`: Register a new business user.
  - `/me`: Get current user details (requires authentication).
- **Maintenance Tips:**
  - Validate input data to prevent malformed registrations.
  - Monitor for duplicate or suspicious registrations.

### 3.4 Group Service

- **Location:** `Backend/services/Group/`
- **Role:** Manages deals/groups, joining/leaving, saving groups, and group history.
- **Endpoints:**
  - `/create`: Create a new group (business users).
  - `/join`: Join a group.
  - `/save`: Save a group to favorites.
  - `/history`: Get group or user history.
- **AI Integration:** Uses TensorFlow.js Universal Sentence Encoder to generate group embeddings for recommendations.
- **Maintenance Tips:**
  - Monitor group creation for spam or abuse.
  - Ensure group embeddings are generated and stored correctly.

### 3.5 Payment Service

- **Location:** `Backend/services/Payment/`
- **Role:** Handles payment processing, Stripe integration, and business onboarding.
- **Endpoints:**
  - `/paymentIntent`: Create a payment intent for a group.
  - `/charge`: Confirm payment.
  - `/create-connected-account`: Onboard a business for Stripe payouts.
  - `/create-account-link`: Generate onboarding link for business.
- **Maintenance Tips:**
  - Securely store Stripe API keys.
  - Monitor payment failures and investigate promptly.
  - Ensure compliance with payment regulations.

### 3.6 Chat Service

- **Location:** `Backend/services/Chat/`
- **Role:** Provides real-time group chat using Socket.IO and REST endpoints for chat history.
- **Endpoints:**
  - `/group/getGroupChat`: Get chat messages for a group (paginated).
  - `/group/getGroupChatsOfUser`: Get all group chats for a user.
- **Socket.IO:**
  - Handles joining/leaving group rooms, sending/receiving messages, and updating last seen.
- **Maintenance Tips:**
  - Monitor socket connections for performance.
  - Ensure chat history is stored and retrievable.

### 3.7 Recommendations Service

- **Location:** `Backend/services/Recommendations/`
- **Role:** Provides personalized group recommendations using AI (Universal Sentence Encoder, vector similarity).
- **Endpoints:**
  - `/get`: Get recommendations for a user (requires authentication).
- **Maintenance Tips:**
  - Monitor AI model performance and retrain as needed.
  - Ensure embeddings are up to date with group changes.

## 4. Database Management

- **Models:** Defined in `Backend/config/models/` using Sequelize.
- **Initialization:** Use `init-db.sh` to set up the database schema.
- **Test Data:** Use `scripts/initData.js` to populate with sample data.
- **Access:** Use Docker or pgAdmin (with SSH tunnel) for direct access.
- **Maintenance Tips:**
  - Regularly backup the database.
  - Monitor for slow queries and optimize indexes.

## 5. Monitoring & Logging

- **Docker Logs:** Use `docker logs <container>` to view logs for each service.
- **Application Logs:** Each service logs requests and errors to the console.
- **Production:** Integrate with a log management system for better visibility.
- **Health Checks:** Monitor service health and resource usage.

## 6. Troubleshooting

- **Check Logs:** Review logs for errors or failed requests.
- **Service Status:** Use `docker ps` to ensure all services are running.
- **Restart Services:** Use `docker-compose restart` as needed.
- **Frontend Debugging:** Use React Native and Expo debugging tools.
- **Backend Debugging:** Use Node.js and Docker tools.

## 7. Updating & Upgrading

- **Code Updates:** Pull latest code and run `npm install` in each service.
- **Docker:** Rebuild images with `docker-compose build` if dependencies change.
- **Testing:** Test updates in a staging environment before production.

## 8. Security

- **SSL:** Store certificates in `Backend/sslKeys/` and keep them updated.
- **Dependencies:** Regularly update to patch vulnerabilities.
- **Secrets:** Use environment variables for sensitive data.
- **Access Control:** Limit access to sensitive files and data.

## 9. Backup & Recovery

- **Database:** Schedule regular backups and test recovery.
- **Files:** Backup SSL certificates and configuration files.

## 10. Contact & Support

- **Documentation:** Refer to this guide and the README files.
- **Team:** Contact the development team for further support.

---

Keep this guide updated as the system evolves.
