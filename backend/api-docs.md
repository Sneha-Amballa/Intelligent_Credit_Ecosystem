# API Documentation

## 1. User Registration

- **Endpoint**: `/api/register`
- **Method**: `POST`
- **Description**: This endpoint is used to create a new user account.
- **Request Body**:
  - `username`: String (required) - The desired username of the user.
  - `email`: String (required) - The user's email address.
  - `password`: String (required) - The user's password.
  - `dateOfBirth`: Date (required) - The user's date of birth.
  - `countryOfOrigin`: String (required) - The user's country of origin.
  - `preferredLanguage`: String (required) - The user's preferred language.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - A message describing the outcome.
  - `user`: Object - Contains user information (excluding password).
- **Error Handling**:
  - Returns `400 Bad Request` if the username already exists, the email already exists, or the email format is incorrect.
  - Returns `500 Internal Server Error` for any server-side errors.
- **Security Notes**:
  - Passwords are hashed before being stored.
  - Email validation is performed to check the format.

## 2. User Login

- **Endpoint**: `/api/login`
- **Method**: `POST`
- **Description**: This endpoint is used for user authentication.
- **Request Body**:
  - `login`: String (required) - The user's username or email address.
  - `password`: String (required) - The user's password.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - A message describing the outcome.
  - `user`: Object - Contains user information (username and email).
- **Error Handling**:
  - Returns `400 Bad Request` if either field is missing or if the user is not found.
  - Returns `401 Unauthorized` if the password does not match.
  - Returns `500 Internal Server Error` for any server-side errors.
- **Security Notes**:
  - Password verification is performed using bcrypt.

## 3. Fetch User Profile

- **Endpoint**: `/api/user/:username`
- **Method**: `GET`
- **Description**: Fetches the profile details of a specific user by their username.
- **URL Parameters**:
  - `username`: String (required) - The username of the user whose profile is being requested.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `user`: Object - Contains the requested user's information (excluding password).
- **Error Handling**:
  - Returns `404 Not Found` if the user does not exist.
  - Returns `500 Internal Server Error` for any server-side errors.

## 4. Fetch All Users 

- **Endpoint**: `/api/users`
- **Method**: `GET`
- **Description**: Retrieves a list of all users. This endpoint is intended for admin use.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `users`: Array - A list of user objects, each containing user information (excluding passwords).
- **Error Handling**:
  - Returns `401 Unauthorized` if the user is not authorized (non-admin).
  - Returns `500 Internal Server Error` for any server-side errors.

## 5. Update User Information

- **Endpoint**: `/api/user/:username`
- **Method**: `PUT`
- **Description**: Allows users to update their account information.
- **URL Parameters**:
  - `username`: String (required) - The current username of the user whose profile is being updated.
- **Request Body** (Any or all of the following):
  - `newUsername`: String (optional) - The new username for the user.
  - `email`: String (optional) - The new email address for the user.
  - `password`: String (optional) - The new password for the user.
  - `dateOfBirth`: Date (optional) - The new date of birth for the user.
  - `countryOfOrigin`: String (optional) - The new country of origin for the user.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - A message describing the outcome.
  - `user`: Object - Contains the updated user's information.
- **Error Handling**:
  - Returns `400 Bad Request` if the new username or email already exists, or if the email format is incorrect.
  - Returns `404 Not Found` if the original user is not found.
  - Returns `500 Internal Server Error` for any server-side errors.
- **Security Notes**:
  - Ensure this endpoint is accessible only to the authenticated user or users with admin privileges.
  - Validate the email format before processing updates.

## 6. Delete User

- **Endpoint**: `/api/user/:username`
- **Method**: `DELETE`
- **Description**: Deletes a specific user's account.
- **URL Parameters**:
  - `username`: String (required) - The username of the user to be deleted.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - A message describing the outcome.
- **Error Handling**:
  - Returns `404 Not Found` if the user does not exist.
  - Returns `500 Internal Server Error` for any server-side errors.

## 7. Fetch User Stats

- **Endpoint**: `/api/stats/:username`
- **Method**: `GET`
- **Description**: Retrieves the statistics associated with a specific user.
- **URL Parameters**:
  - `username`: String (required) - The username of the user whose stats are being requested.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `data`: Object - Contains the user's statistics.
    - `username`: String - The username of the user.
    - `completionPercentages`: Array of Numbers - An array of completion percentages.
    - `points`: Array of Numbers - An array of points.
    - `correctAnswers`: Number - The count of correct answers.
    - `incorrectAnswers`: Number - The count of incorrect answers.
    - `totalCompletion`: Number - The average of all completion percentages.
    - `totalPoints`: Number - The sum of all points.
    - `correctAnswersPercentage`: Number - The percentage of correct answers.
    - `progress`: Array of Objects - Each object contains `blockId` and `minilessonId` representing the user's progress.
- **Error Handling**:
  - Returns `404 Not Found` if the stats for the given username are not found.
  - Returns `500 Internal Server Error` for any server-side errors.

## 8. Update User Stats

- **Endpoint**: `/api/stats/:username`
- **Method**: `PUT`
- **Description**: Updates the statistics associated with a specific user.
- **URL Parameters**:
  - `username`: String (required) - The username of the user whose stats are to be updated.
- **Request Body** (Any or all of the following):
  - `newPoints`: Number (optional) - The new points to be added to the user's total on the index of `locationId`.
  - `locationId`: Number (optional) - Identifier of location where `newPoints` are to be increased.
  - `correctAnswers`: Number (optional) - The amount to increase total correctAnswers of a user.
  - `incorrectAnswers`: Number (optional) - The amount to increase total incorrectAnswers of a user.
  - `progress`: Object (optional) - An object containing the progress update. When this field is updated, the completion percentages are automatically recalculated and updated. The object should have the following structure:
    - `locationName`: String (required for progress update) - The name of the location.
    - `locationId`: Number (required for progress update) - The index in the progress array to update.
    - `lessonId`: Number (required for progress update) - The new lesson ID to set.
    - `minilessonId`: Number (required for progress update) - The new minilesson ID to set.
    - `blockId`: Number (required for progress update) - The new block ID to set.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - A message describing the outcome.
  - `data`: Object - Contains the updated stats for the user.
- **Error Handling**:
  - Returns `400 Bad Request` if the provided data is invalid or if required fields are missing.
  - Returns `404 Not Found` if no stats are found for the given username.
  - Returns `500 Internal Server Error` for any server-side errors.

## 9. Reset User Stats

- **Endpoint**: `/api/stats/reset/:username`
- **Method**: `PUT`
- **Description**: Resets the statistics associated with a specific user.
- **URL Parameters**:
  - `username`: String (required) - The username of the user whose stats are to be reset.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - A message describing the outcome of the operation.
  - `data`: Object - Contains the reset stats for the user.
- **Error Handling**:
  - Returns `404 Not Found` if no stats are found for the given username.
  - Returns `500 Internal Server Error` if an error occurs during the operation, along with an error message detailing the issue.

## 10. General Leaderboard

- **Endpoint**: `/api/leaderboard`
- **Method**: `GET`
- **Description**: This method provides a leaderboard of the first 100 users, sorted by their total points. It supports optional filtering based on the user's age and country of origin. Each user's entry includes their username, country, age, total points, and rank.
- **Query Parameters**:
  - `age` (optional): Integer - Specifies the age to filter the leaderboard.
  - `country` (optional): String - Specifies the country to filter the leaderboard.
- **Response**: 
  - `success`: Boolean - Indicates if the operation was successful.
  - `leaderboard`: Array of Objects - List of user rankings, each containing:
    - `username`: String - The user's username.
    - `countryOfOrigin`: String - The user's country of origin.
    - `age`: Number - The user's age, calculated from their date of birth.
    - `totalPoints`: Number - The total points accumulated by the user.
    - `rank`: Number - The user's rank in the leaderboard. Users with the same number of points share the same rank.
- **Error Handling**:
  - On server-side errors, returns `500 Internal Server Error` with an error message.

## 11. Get Leaderboard By User

- **Endpoint**: `/api/leaderboard/:username`
- **Method**: `GET`
- **Description**: Retrieves the ranking information of a specific user across different leaderboards (general, age-based, and country-based). This method finds the user's rank in each of these categories. If the user is not found, a 404 error is returned.
- **Path Parameters**:
  - `username`: String - The username of the user for whom to retrieve leaderboard data.
- **Response**: 
  - `success`: Boolean - Indicates if the operation was successful.
  - `userData`: Object - Contains the ranking information of the user in different leaderboards. It includes:
    - `username`: String - The user's username.
    - `age`: Number - The user's age, calculated from their date of birth.
    - `country`: String - The user's country of origin.
    - `generalRank`: Number - The user's rank in the general leaderboard.
    - `ageRank`: Number - The user's rank in the age-specific leaderboard.
    - `countryRank`: Number - The user's rank in the country-specific leaderboard.
- **Error Handling**:
  - If the user is not found, returns `404 Not Found` with an appropriate error message.
  - On server-side errors, returns `500 Internal Server Error` with an error message.
