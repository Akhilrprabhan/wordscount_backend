

# Word Count Checker

A MERN stack application that checks the word count of a website and allows users to mark URLs as favorites.

## Backend (server.js)

### Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- Axios
- Cheerio

### Installation and Setup
1. Clone the repository.
2. Run `npm install` to install the required dependencies.
3. Update the MongoDB connection URL in `server.js` to your own MongoDB Atlas URL.
4. Run `npm start` to start the backend server.

### API Endpoints

- `POST /word-count`: Accepts a URL in the request body, retrieves the website's content, and calculates the word count. It also extracts web links from the HTML and saves the word count data to the database.
- `PUT /mark-favorite`: Accepts a URL and a boolean value in the request body, and updates the `isFavorite` field of the corresponding URL in the database.
- `GET /word-counts`: Retrieves all word count data from the database.

## Frontend (App.js)

### Technologies Used
- React
- Axios
- Bootstrap

### Installation and Setup
1. Run `npm install` to install the required dependencies.
2. Update the API URLs in the `handleWordCountCheck`, `retrieveWordCountData`, and `handleMarkFavorite` functions in `WordCountChecker.jsx` to match your backend server URL.
3. Run `npm start` to start the frontend server.

### Usage
- Enter a website URL in the input field and click "Check Word Count" to calculate the word count and save the data to the database.
- The retrieved word count data will be displayed in a table, showing the website URL, word count, favorite status, extracted web links, and an option to mark URLs as favorites.


