
## Authors

- [@Awais Akram](https://www.github.com/31102)

# Blog Frontend (Vite)

## Installation

To get started with the Blog frontend project, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd blog-fe

2. **install npm**
   ```bash
   npm install

3. **Run the Development Server**
   ```bash
   npm run dev
   
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`VITE_BASE_URL=http://localhost:3000/`
`VITE_TINYMCE_API_KEY=you-tinymc-key`


## Features

- Authentication Context: Manage user authentication state throughout your application.
- Form Validation with Zod: Use Zod for schema-based validation to ensure data integrity in forms.
- React Hook Form: Implement forms easily with efficient state management and validation.
- Custom Input Components: Create reusable input components for a consistent UI.
- Text Editor: Integrated TinyMCE for rich text editing capabilities.


## Dependencies
- React and React-DOM: The core libraries for building the user interface.
- React Router: For routing and navigation.
- Bootstrap and React Bootstrap: For responsive UI components.
- TinyMCE React: For the rich text editor feature.
- Axios: For making HTTP requests.
- Zod: For schema validation in forms.
- React Hook Form: For managing form state efficiently.