# HIPAA-CHECKER

## Password Reset

To reset your password, please use the following URL with your `BASE_URL` and `TOKEN` values:

```bash
{{BASE_URL}}/reset-password?reset_password_token={{TOKEN}}
```

This URL needs to be integrated into the email sent from the server for the password reset functionality.

## Pre-Installation Steps

Before installing this application, ensure you complete the following:

1. Create a `.env` file.
2. Copy the contents from `.env.example` to your `.env` file.
3. Set the `BASE_URL` path in the `.env` file.

## Configuration

1. Install Node.js (version 18.17.0 or higher).
   - If you don't have Node.js installed, you can download it https://nodejs.org/en.

### Installing Dependencies

To install the necessary dependencies, run the following command:

```bash
npm install
```

### Running the Project

To run the development environment locally, execute:

```bash
npm run dev
```

### Building the Project

To build the project, use the following command:

```bash
npm run build
```

### Starting the Project

To start the project after building, run:

```bash
npm start
```
