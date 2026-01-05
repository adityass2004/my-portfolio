import { NextRequest, NextResponse } from 'next/server';
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

function getPortfolioData(): PortfolioData {
  try {
    const filePath = path.join(process.cwd(), 'public/portfolioData.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Failed to read portfolio data:', error);
    throw new Error('Failed to read data');
  }
}

function updatePortfolioData(newData: PortfolioData): void {
  try {
    if (!newData.personalInfo || !newData.projects) {
      throw new Error('Invalid data format');
    }

    const filePath = path.join(process.cwd(), 'public/portfolioData.json');
    
    // Create backup
    const backupPath = path.join(process.cwd(), 'public', `portfolioData.backup.${Date.now()}.json`);
    const currentData = fs.readFileSync(filePath, 'utf8');
    fs.writeFileSync(backupPath, currentData);

    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to save portfolio data:', error);
    throw new Error('Failed to save data');
  }
}

export async function GET() {
  try {
    const data = getPortfolioData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read portfolio data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    updatePortfolioData(body);
    return NextResponse.json({ message: 'Portfolio data updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update portfolio data' },
      { status: 500 }
    );
  }
}