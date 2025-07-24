# Project Structure

The project is structured as follows:

- `backend/`: Contains the backend code for the application.
    - `src/`: Contains the source code for the backend.
        - `ai/`: Contains the AI related code.
            - `classifier.ts`: Contains the code for categorizing emails using an AI model.
            - `geminiClient.ts`: Contains the code for initializing the Gemini AI model.
        - `elastic/`: Contains the code for interacting with the Elasticsearch database.
            - `types.ts`: Contains the types used in the Elasticsearch database.
        - `index.ts`: The entry point of the backend application.
    - `README.md`: Contains the documentation for the backend.
    - `.env`: Contains the environment variables for the backend.

- `frontend/`: Contains the frontend code for the application.
    - `src/`: Contains the source code for the frontend.
        - `App.js`: The main component of the frontend application.
        - `index.js`: The entry point of the frontend application.
    - `README.md`: Contains the documentation for the frontend.
    - `.env`: Contains the environment variables for the frontend.

# Installation

To install the application, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/your-repo.git`
2. Navigate to the project directory: `cd your-repo`
3. Install the backend dependencies: `cd backend && npm install`
4. Install the frontend dependencies: `cd frontend && npm install`

# Running the Application

To run the application, follow these steps:

1. Start the backend: `cd backend && npm start`
2. Start the frontend: `cd frontend && npm start`

# Relevant Information

- The backend application uses the `GEMINI_API_KEY` environment variable to initialize the Gemini AI model. Make sure to set this environment variable before starting the backend.
- The frontend application uses the `REACT_APP_BACKEND_URL` environment variable to connect to the backend. Make sure to set this environment variable before starting the frontend.
