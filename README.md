# Personal Finance Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Shadcn/UI](https://img.shields.io/badge/shadcn/ui-%23000000.svg?style=for-the-badge&logo=shadcn-ui&logoColor=white)
![Recharts](https://img.shields.io/badge/recharts-61DAFB?style=for-the-badge&logo=recharts&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234EA94B.svg?style=for-the-badge&logo=mongodb&logoColor=white)

## Overview

The Personal Finance Tracker is a modern, user-friendly application designed to help you manage your personal finances effectively. Built with Next.js, React, and shadcn/ui, it offers a responsive and intuitive interface for tracking income, expenses, and investments. Leverage powerful data visualization with Recharts to gain valuable insights into your spending habits and overall financial health. The data is stored securely using MongoDB. This tool is perfect for individuals seeking better control over their finances and informed decision-making capabilities.

## Features

*   **Income Tracking:** Easily record income from various sources like salary, investments, and other earnings.
*   **Expense Tracking:** Categorize and track expenses to understand where your money is going.
*   **Budgeting:** Set monthly budgets for different categories and monitor your progress against them.
*   **Investment Tracking:** Keep track of investments, including stocks, bonds, and mutual funds.
*   **Reporting:** Generate detailed reports and visualizations to analyze financial data over time using Recharts.
*   **User-friendly Interface:** Intuitive design with React and shadcn/ui for easy navigation and data entry.
*   **Data Security:** Secure storage of your financial data with MongoDB.
*   **Multi-Currency Support:** Track finances in different currencies.
*   **Responsive Design:**  Works seamlessly on desktop and mobile devices.

## Installation

### Prerequisites

Before installing the Personal Finance Tracker, ensure you have the following:

*   Node.js: Version 16 or higher is recommended.
*   npm or yarn: Package managers for JavaScript.
*   MongoDB: A running instance of MongoDB.

### Steps

1.  **Clone the repository:**

    bash
    npm install # or yarn install
        > Replace `<your_mongodb_uri>` with the connection string for your MongoDB database. Example: `mongodb://localhost:27017/finance_tracker`.  The `NEXT_PUBLIC_APP_URL` should be the URL where the application is running. Add any other environment variables your application requires.  Remember that variables prefixed with `NEXT_PUBLIC_` are exposed to the client-side code.

4.  **Run database migrations (if applicable):**

    > If you are using a database migration tool (e.g., Prisma, Mongoose), run the migrations to set up your database schema.  Provide specific commands here based on the tool used. Example using Mongoose:

bash
    # Example using a custom script
    npm run db:migrate
        This will start the Next.js development server, usually on `http://localhost:3000`.

## Usage

### Adding Income

1.  Navigate to the "Income" section in the application.
2.  Click on "Add Income".
3.  Fill in the details such as source, amount, and date.
4.  Click "Save".

    ![Adding Income](docs/screenshots/income.png)

    > Replace `docs/screenshots/income.png` with the actual path or URL to your screenshot within the repository.  Create a `docs/screenshots` directory to store the images.

### Tracking Expenses

1.  Go to the "Expenses" section.
2.  Click "Add Expense".
3.  Enter the necessary details, including category, amount, and date.
4.  Click "Save".

    ![Tracking Expenses](docs/screenshots/expenses.png)

    > Replace `docs/screenshots/expenses.png` with the actual path or URL to your screenshot.

### Generating Reports

1.  Go to the "Reports" section.
2.  Select the desired report type and date range.
3.  Click "Generate Report".

    ![Generating Reports](docs/screenshots/reports.png)

    > Replace `docs/screenshots/reports.png` with the actual path or URL to your screenshot. The reports are rendered using Recharts, providing interactive and visually appealing data representations.


## Troubleshooting

### Common Issues and Solutions

*   **Application crashes on startup:**
    *   Ensure all dependencies are installed correctly by checking the output of `npm install` or `yarn install`.
    *   Verify the `.env.local` file for correct configuration variables, especially the `MONGODB_URI` and `NEXT_PUBLIC_APP_URL`. Double-check for typos.
    *   Check the browser console and server logs for any error messages.
*   **Database connection errors:**
    *   Verify the MongoDB URI in the `.env.local` file is correct and that the MongoDB server is running and accessible.
    *   Ensure that your MongoDB user has the necessary permissions to access the database.
*   **Recharts not rendering:**
    *   Check if the necessary data is available for the selected date range. Ensure that income and expense entries exist for the period.
    *   Inspect the browser console for any errors related to Recharts.
    *   Verify Recharts is correctly imported and used in your React components.
*   **Component styling issues:**
    *   If you are experiencing styling issues with shadcn/ui components, ensure that you have followed the installation and usage instructions correctly.
    *   Check for any conflicting CSS styles in your application.
    *   Refer to the shadcn/ui documentation for component-specific troubleshooting.



## Contributing

We welcome contributions to the Personal Finance Tracker! If you'd like to contribute, please follow these guidelines:

1.  **Fork the repository** on GitHub.
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `git checkout -b bugfix/your-bugfix-name`.
3.  **Make your changes** and ensure they are well-documented using clear comments.
4.  **Write tests** to cover your changes using a testing framework like Jest and React Testing Library. Ensure that all tests pass before submitting a pull request.
5.  **Follow the coding style** used in the project.  (Consider adding a style guide, e.g., ESLint and Prettier configuration).
6.  **Commit your changes** with descriptive commit messages.
7.  **Submit a pull request** to the `main` branch.

> Please ensure your pull request adheres to the coding standards, includes a clear description of the changes, and passes all tests. Be prepared to address any feedback from the project maintainers.  Consider adding a link to your project's code of conduct.

## License

MIT License. See the `LICENSE` file for details.