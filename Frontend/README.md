# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



Frontend → axios('/api/...') → Proxy → Backend http://localhost:5000/api/... → Controller → Database


React Frontend (localhost:5173)
        |
        |  axios.post('/api/message')
        v
Vite Proxy (redirects automatically)
        |
        v
Backend Server (localhost:5000/api/message)
        |
        v
Response sent back to frontend


[User interacts UI]
        ↓
React Component (calls userAPI → axios.post('/users', formData))
        ↓
Vite Dev Server (proxy sees '/api' and forwards)
        ↓
Backend Server (Express) at http://localhost:8000/api/users
        ↓
Controller handles file upload (multer in memory) → streams to Cloudinary
        ↓
Mongoose writes user record to MongoDB Atlas
        ↓
Controller responds JSON → axios receives → React updates state → UI re-renders




| Component              | Purpose                                                                         | When You Need It                              |
| ---------------------- | ------------------------------------------------------------------------------- | --------------------------------------------- |
| **server.js / app.js** | Starts Express server, connects to DB                                           | Always                                        |
| **routes/**            | Defines all endpoint paths                                                      | Always                                        |
| **controllers/**       | Holds logic for each route (like registerUser, loginUser)                       | Always                                        |
| **models/**            | Defines database schemas (e.g., User, Post)                                     | If you use a database                         |
| **middleware/**        | For reusable logic that runs before controllers (auth checks, validation, etc.) | When routes need protection or pre-processing |
| **utils/**             | For helper functions (JWT generation, hashing, email sending)                   | When needed                                   |
| **config/**            | For database and environment setup                                              | Always                                        |
| **.env**               | Stores environment variables like DB URI, JWT secret                            | Always                                        |
