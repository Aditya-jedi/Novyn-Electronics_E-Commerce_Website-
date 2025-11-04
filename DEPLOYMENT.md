# Deployment Guide

## Frontend Deployment

1. **Build the frontend for production:**
   ```bash
   cd Frontend
   npm run build
   ```

2. **Deploy the `dist` folder:**
   - Upload the contents of the `Frontend/dist` folder to your web hosting service (e.g., Netlify, Vercel, AWS S3, etc.)
   - For static hosting, ensure the hosting service serves `index.html` for all routes (SPA routing)

3. **Environment Variables:**
   - Copy `Frontend/.env.example` to `Frontend/.env`
   - Update `VITE_API_BASE_URL` with your deployed backend URL
   - For local development, the fallback `/api` works if using a proxy

## Backend Deployment

1. **Environment Setup:**
   - Copy `Backend/.env.example` to `Backend/.env`
   - Fill in the required values:
     - `MONGO_URI`: Your MongoDB connection string
     - `PORT`: Server port (default 5000)
     - `JWT_SECRET`: Secure random string for JWT
     - `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`: Your Razorpay credentials

2. **Deploy to a cloud platform:**
   - **Heroku:**
     ```bash
     cd Backend
     heroku create your-app-name
     git push heroku main
     ```
   - **Railway, Render, or DigitalOcean App Platform:**
     - Connect your repository
     - Set environment variables in the platform's dashboard
     - Deploy

3. **Database:**
   - Use MongoDB Atlas for cloud database
   - Update `MONGO_URI` with the Atlas connection string

## Full Stack Deployment

1. Deploy backend first and note the URL
2. Update frontend environment variables with backend URL
3. Build and deploy frontend
4. Test the deployed application

## Additional Notes

- Ensure CORS is properly configured in the backend for the frontend domain
- Set up proper error handling and logging in production
- Consider using a reverse proxy (nginx) for production deployments
- Implement HTTPS in production
- Set up monitoring and alerts for your deployed application
