# Hotel Inspection
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.
<br />
I hope this simple app [Inspectors]() will be some of help to part-time workers and employees engaged in hotel inspection.


## Backend

- MongoDB, Mongoose 
- Express
- NodeJS
- bcrypt.js
- JWT(JSON Web Token)
- Passport
- Passport Google OAuth20


## Frontend

- React
- Redux-Toolkit
- React-Router-DOM
- Axios


## API

### Google Authentication
- Register and login Google user : [GET]  /auth/google
- Logout Google user             : [POST] /auth/logout

### Inspectors
- Without Token
    - Register new user : [POST] /api/users
    - Login user        : [POST] /api/users/login
- With Token
    - Logout user       : [GET]    /api/users/logout
    - Create new room   : [POST]   /api/rooms
    - Get user's rooms  : [GET]    /api/rooms
    - Delete room       : [DELETE] /api/rooms/:id
    - Update room       : [PATCH]  /api/rooms/:id
    - Create new item   : [POST]   /api/items
    - Get user's items  : [GET]    /api/items
    - Delete item       : [DELETE] /api/items/:id