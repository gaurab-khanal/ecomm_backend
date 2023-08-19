# ecomm_backend

## Installing Project Locally

### 1. Get the code

- Fork and then clone
  ```bash
  $ git clone https://github.com/YOUR-USERNAME/ecomm_backend
  ```
- cd into project using
  ```bash
  $ cd ecomm_backend
  ```

  ## Setting Up Server
  
- Install dependencies
  ```bash
  $ npm install
  ```

  ### 2. Setup Environment Variable

  - Create .env file at ecomm_backend
  - Copy and paste the below code. Note: Replace values with your own values.
    ```
    PORT = 4000
    DB_URL = <YOUR DB URO>
    JWT_SECRET = <SECRET KEY?
    JWT_EXPIRY = <JWT EXPIRY TIME>
    COOKIE_TIME = <Cookie Expiry Time>
    
    CLOUDINARY_NAME = <CLOUDINARY NAME>
    CLOUDINARY_API_KEY = <CLOUDINARY API KEY>
    CLOUDINARY_API_SECRET = < CLOUDINARY_API_SECRET>
    
    SMTP_HOST = sandbox.smtp.mailtrap.io
    SMTP_PORT = <SMTP PORT>
    SMTP_USER = <USER ID>
    SMTP_PASS = <USER PASS>
    ```
 ### 3. Run Project
 ```bash
  $ npm run dev
  ```
