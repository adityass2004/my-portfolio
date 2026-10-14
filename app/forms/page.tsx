import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import type { PortfolioData } from '../data/portfolioService';
import FormsClient from './FormsClient';

export const metadata: Metadata = {
  title: 'Quick Copy — Form Details',
  description: 'Quickly copy personal, education, and professional details for job, internship, and application forms.',
};

async function getPortfolioData(): Promise<PortfolioData> {
  const filePath = path.join(process.cwd(), 'public', 'portfolioData.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as PortfolioData;
}

export default async function FormsPage() {
  const data = await getPortfolioData();
  return <FormsClient data={data} />;
}
