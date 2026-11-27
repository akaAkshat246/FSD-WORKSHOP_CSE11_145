# AVS Login Page

A small Node.js login and signup page with a user list. Signed-in users can edit or delete accounts.

## Run

1. Install Node.js 18 or later.
2. Open a terminal in this folder.
3. Run `npm start`.
4. Visit http://localhost:3001.

Signup stores the email and a salted password hash in `userData.json`. The plain-text password is not saved. Signed-in users can view all accounts and edit or delete them.

## API routes

- `POST /signup` creates an account.
- `POST /login` checks the email and password and returns a login token.
- `GET /employee` lists signed-up accounts. Send the token as `Authorization: Bearer <token>`.
- `PUT /edit/:id` updates a user's name or email.
- `DELETE /delete/:id` deletes a user.