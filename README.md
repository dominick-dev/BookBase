# Bookbase Project

## Overview

Bookbase is a web application designed to provide users with a comprehensive platform for exploring books and reviews. Built with a React frontend and an Express backend, the application leverages PostgreSQL for data storage and retrieval. The project is structured to support various features such as book search, review display, and user interaction.

## Features

- **Book Search**: Search for books by title, author, ISBN, or publisher.
- **Review Display**: View reviews for specific books, sorted by helpfulness.
- **Random Book**: Fetch a random book from the database.
- **Popular Books by Location**: Discover popular books based on geographic location.
- **Polarizing Books**: Identify books with mixed reviews.
- **Books by Age Group**: Find books popular among specific age groups.
- **Books by Location**: Search for books based on city, state, or country.
- **Top Reviewer Favorites**: Explore books favored by top reviewers in a specific genre.
- **Magnum Opus**: Find the highest-rated book by a specific author.
- **Hidden Gems**: Discover highly-rated books with few reviews.
- **Helpful Users**: Identify users with the most helpful reviews.
- **Author and Genre Stats**: Get statistics on authors and genres.

## Technologies Used

- **Frontend**: React, Vite, Bootstrap, MUI
- **Backend**: Express, Node.js
- **Database**: PostgreSQL, MongoDB
- **Testing**: Jest
- **Build Tools**: Vite

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hi-jaxon/5500project
   cd bookbase
   ```

2. **Install dependencies**:
   - For the client:
     ```bash
     cd client
     npm install
     ```
   - For the server:
     ```bash
     cd server
     npm install
     ```

3. **Set up the database**:
   - Ensure PostgreSQL is installed and running.
   - Create a database and fill out the `config.json` file in the `server` directory with your database credentials.

4. **Run the application**:
   - Start the server:
     ```bash
     cd server
     npm start
     ```
   - Start the client:
     ```bash
     cd client
     npm run dev
     ```

5. **Access the application**:
   - Open your browser and navigate to the URL shown in the terminal.

## Testing

- **Client Tests**: Run tests for the client-side code using Jest and Testing Library.
  ```bash
  cd client
  npm test
  ```

- **Server Tests**: Run tests for the server-side code using Jest and Supertest.
  ```bash
  cd server
  npm test
  ```

## Acknowledgments

- Students: Aadit Vyas, Dominic DeVincenzo, Jaxon Bailey, and Zakaria Loudini
