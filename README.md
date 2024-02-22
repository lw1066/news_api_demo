# News API Demo
This project is a basic online article API serving endpoints for fetching articles, comments, topics, and users. 
Explore a hosted version **[News API Demo](https://news-api-demo.onrender.com/api)** or follow the instructions below to setup locally. 
The git repository is available to explore [HERE](https://github.com/lw1066/news_api_demo).

## Local setup Instructions
[Node.js](https://nodejs.org/) v16.0.0 and [PostgreSQL](https://www.postgresql.org/) v13.0.0 to work
1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/lw1066/news_api_demo.git
   npm install

2. **Environment Variables**

    Create .env files in the root directory.
    This project requires two .env files for configuration:

    **.env.development**

        PGDATABASE: Database name for development environment
        PGUSER: PostgreSQL username for development environment
        PGPASSWORD: PostgreSQL password for development environment

    **.env.test**

         Similar variables as above for the test environment


3. **Seed local database:**
    ```bash
    npm run setup-dbs
    npm run seed

4. **To run tests (jest):**
    ```bash
    npm test

4. **To run the api:**
    ```bash
    npm start

## Available Endpoints
- **GET /api**

    Serves up a JSON representation of all the available endpoints of the API.

- **GET /api/topics**

    Serves an array of all topics.

- **GET /api/articles**

    Serves an array of all articles without their body texts sorted in descending date order.
    Queries: topic: filters articles by topic column

- **GET /api/articles/:article_id**

    Serves an article selected by :article_id.

- **GET /api/articles/:article_id/comments**

    Serves all comments for an article selected by :article_id.

- **POST /api/articles/:article_id/comments**

    Adds a comment to an article selected by article_id and serves the posted comment.

    Example Request Body:

    ```json
    {
    "userName": "userName in db",
    "body": "comment to post"
    }
    ```

- **PATCH /api/articles/:article_id**

    Changes number of votes on the selected article by amount provided in inc_votes.

    Example Request Body:

    ```json
    {
    "inc_votes": 3
    }
    ```

- **DELETE /api/comments/:comment_id**

    Deletes a comment with the given comment_id.

- **GET /api/users**

    Serves an array of all users.

### If you find an issue/bug, please [report it here](https://github.com/lw1066/news_api_demo/issues) - thanks!


