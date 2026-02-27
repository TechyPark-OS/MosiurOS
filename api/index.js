export default function handler(request, response) {
  response.status(200).json({ 
    message: "TechyPark Engine API", 
    timestamp: new Date().toISOString() 
  });
}
