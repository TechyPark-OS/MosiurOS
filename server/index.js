// At the bottom of server/index.js
const PORT = process.env.PORT || 3000;

// Only start server if not running on Vercel
if (!process.env.NOW_REGION) {
  app.listen(PORT, () => {
    console.log(`TechyPark Engine API server running on port ${PORT}`);
  });
}

// Export for Vercel
export default app;
