import { NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { IamAuthenticator } from 'ibm-watson/auth';
import NaturalLanguageUnderstandingV1 from 'ibm-watson/natural-language-understanding/v1';
import { PutDataResumeAnalysis } from '@/actions/db.actions';

export async function POST(request) {
  try {
    // Verify IBM Watson credentials
    if (!process.env.IBM_API_KEY || !process.env.IBM_URL) {
      throw new Error('IBM Watson service not configured');
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded. Please select a DOCX file to analyze.' },
        { status: 400 }
      );
    }

    // Enhanced file type validation
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.docx')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only .docx files are supported.' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    let textContent = '';

    // DOCX parsing
    try {
      const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
      textContent = result.value;
      
      if (!textContent.trim()) {
        return NextResponse.json(
          { error: 'The document appears to be empty or contains no readable text.' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('DOCX parsing error:', error);
      return NextResponse.json(
        { error: 'Failed to parse DOCX file. Please ensure it is a valid Word document.' },
        { status: 400 }
      );
    }

    // IBM Watson analysis
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
      version: '2021-08-01',
      authenticator: new IamAuthenticator({ apikey: process.env.IBM_API_KEY }),
      serviceUrl: process.env.IBM_URL,
    });

    const analysisResults = await naturalLanguageUnderstanding.analyze({
      text: textContent,
      features: {
        keywords: { limit: 10 },
        concepts: { limit: 5 },
        entities: { limit: 5 },
        sentiment: {},
        emotion: {},
      },
    });

    // Prepare data for database
    const dbData = {
      filename: file.name,
      inputText: textContent,
      sentimentLabel: analysisResults.result.sentiment?.document?.label || null,
      sentimentScore: analysisResults.result.sentiment?.document?.score || null,
      emotion: analysisResults.result.emotion?.document?.emotion || null,
      keywords: analysisResults.result.keywords || []
    };

    // Save to database
    await PutDataResumeAnalysis(dbData);

    return NextResponse.json({
      insights: analysisResults.result,
      message: 'DOCX resume analyzed successfully!'
    }, { status: 200 });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing your document' },
      { status: 500 }
    );
  }
}