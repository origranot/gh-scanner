# Github Scanner

## Description

This is a simple GraphQL API that scans a Github user repositories and returns the repositories and their details.

## Getting Started

To set up and run the project, follow these steps:

1. Clone the repository to your local machine.
2. Install the necessary dependencies using `npm install` or `yarn install`.
3. Copy the `.example.env` file to `.env` and update the values as needed.
4. Start the API server with `npm start` or `yarn start`.

The API server will be accessible at `http://localhost:3000` by default.
Playground is accessible at `http://localhost:3000/graphql` by default.

### Design Decisions

I decided to store the repositories in a cache for a faster response time. The cache is stored in memory, but could be easily swapped out for a distributed cache like Redis.

I created a basic interval to scan the user repositories. In a real world scenario, I would use a cron job queue like Bull to handle the scanning of the repositories. This would allow for better control of the jobs and allow for more control over the scanning process.

I decided to use my real Github account and repositories, feels like it has more data than cloning the test repositories couple of times.

### Limitations

In the scanning process, I omit the scan process of all the providers in a loop. In a real world scenario, I would split the providers into different jobs and run them in parallel. This would allow for a faster scanning process.

There is no error handling in the scanning process. In a real world scenario, I would add error handling and retry logic to the scanning process. This would allow for a more robust scanning process.

In a real world scenario we should keep in mind the rate limit of the Github API. I would add a rate limit check to the scanning process to ensure we don't hit the rate limit.

There is no tests in the project. In a real world scenario, I would add tests to the project to ensure the quality of the code. and the stability of the project.
