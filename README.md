# frontendRoorkee

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Description

Launchpad is a user-friendly web application designed to provide an intuitive interface for accessing government schemes, scholarships, job opportunities, and other beneficial programs targeted at minority and SC/ST communities. This frontend interacts with a backend platform to consolidate and display relevant data in an accessible format.

## Getting Started

### Prerequisites

Before running this project, ensure you have the following installed:

- **[Node.js](https://nodejs.org/):** Required for running the development server and managing dependencies.
- **npm, Yarn, pnpm, or Bun:** Package managers for handling dependencies (npm comes bundled with Node.js).

### Installation

Follow these steps to set up the project on your local machine:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/your-frontend-repo-name.git
   cd your-frontend-repo-name
   ```

2. **Install Dependencies**

   Use one of the following commands to install project dependencies:

   ```bash
   npm install  # Using npm
   yarn install  # Using Yarn
   pnpm install  # Using pnpm
   bun install  # Using Bun
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add the following:

   ```env
   NEXT_PUBLIC_API_BASE_URL=<YOUR_BACKEND_API_URL>
   ```

   Replace `<YOUR_BACKEND_API_URL>` with the actual API base URL of your backend server.

## API Setup

The frontend interacts with the backend API, which can be set up using the following repository:

- **Backend Repository:** [Community Empowerment Portal Backend](https://github.com/Community-Empowerment-Portal/backend-roorkee)

### Running the Development Server

Start the local development server with:

```bash
npm run dev  # Using npm
yarn dev  # Using Yarn
pnpm dev  # Using pnpm
bun dev  # Using Bun
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

## Features

- **Responsive Design:** Ensures a seamless experience across different devices and screen sizes.
- **Data Integration:** Fetches and displays government schemes, scholarships, and job opportunities from the backend API.
- **Search & Filter:** Allows users to search and filter programs based on various criteria.
- **User Authentication:** Supports login and session management (if implemented).
- **Interactive UI:** Provides an intuitive and modern user experience.


## Learn More

For more information on Next.js, check out:

- [Next.js Documentation](https://nextjs.org/docs) - Official Next.js documentation.
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial.

---

Contributions and feedback are welcome! If you encounter any issues or have suggestions, feel free to open an issue or submit a pull request. 

