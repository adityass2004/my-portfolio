// Portfolio API utility for Create React App
// Note: This file is for reference only - actual API is in setupProxy.js

import fs from 'fs';
import path from 'path';

interface PortfolioData {
  personalInfo: any;
  projects: any[];
  experience: any[];
  certifications: any[];
  education: any[];
  contactInfo: any;
}

export function getPortfolioData(): PortfolioData {
  try {
    const filePath = path.join(process.cwd(), 'public/portfolioData.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Failed to read portfolio data:', error);
    throw new Error('Failed to read data');
  }
}

export function updatePortfolioData(newData: PortfolioData): void {
  try {
    // Basic validation to ensure the structure isn't corrupted
    if (!newData.personalInfo || !newData.projects) {
      throw new Error('Invalid data format');
    }

    const filePath = path.join(process.cwd(), 'public/portfolioData.json');
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to save portfolio data:', error);
    throw new Error('Failed to save data');
  }
}