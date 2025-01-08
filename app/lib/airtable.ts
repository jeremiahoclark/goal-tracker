import Airtable from 'airtable';

if (!process.env.AIRTABLE_API_KEY) {
  throw new Error('AIRTABLE_API_KEY is required');
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appmePGTRHHESvrPU');

export const goalsTable = base('Goals');
export const progressTable = base('Daily Progress'); 