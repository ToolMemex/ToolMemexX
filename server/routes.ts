import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Since this app runs completely client-side, we don't need
  // many API routes. In a real application, we would have routes
  // for saving memes, user authentication, etc.
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  
  // Optional: API endpoint for saving memes (unused in current implementation)
  app.post('/api/memes', (req, res) => {
    try {
      const { imageData, caption } = req.body;
      
      if (!imageData || !caption) {
        return res.status(400).json({ 
          error: 'Missing required fields' 
        });
      }
      
      // In a real app, we would save the meme to the database
      return res.status(201).json({ 
        success: true, 
        message: 'Meme saved successfully',
        id: Date.now() 
      });
    } catch (error) {
      console.error('Error saving meme:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Download meme endpoint
  app.post('/api/download-meme', express.urlencoded({ extended: true, limit: '50mb' }), (req, res) => {
    try {
      const { imageData } = req.body;
      
      if (!imageData) {
        return res.status(400).json({ error: 'No image data provided' });
      }
      
      // Extract the base64 data (remove data:image/png;base64, prefix if present)
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Set response headers for file download
      res.setHeader('Content-Disposition', 'attachment; filename=ToolMemeX-creation.png');
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Length', buffer.length);
      
      // Send the buffer as response
      res.end(buffer);
    } catch (error) {
      console.error('Error handling download:', error);
      res.status(500).json({ error: 'Failed to process download' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
