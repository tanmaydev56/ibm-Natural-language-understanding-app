import { NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { IamAuthenticator } from 'ibm-watson/auth';
import NaturalLanguageUnderstandingV1 from 'ibm-watson/natural-language-understanding/v1';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PutDataResumeAnalysis } from '@/actions/db.actions';

export async function POST(request) {
  try {
    // Verify all required credentials
    if (!process.env.IBM_API_KEY || !process.env.IBM_URL) {
      throw new Error('IBM Watson service not configured');
    }
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const formData = await request.formData();
    const file = formData.get('file') ;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded. Please select a DOCX file to analyze.' },
        { status: 400 }
      );
    }

    // File type validation
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
        keywords: { 
          limit: 10,
          sentiment: true,
          emotion: true
        },
        concepts: { limit: 5 },
        entities: { limit: 5 },
        sentiment: {
          targets: [
            'experience',
            'skills',
            'education',
            'achievements',
            'summary'
          ]
        },
        emotion: {
          targets: [
            'experience',
            'skills',
            'education',
            'achievements',
            'summary'
          ]
        },
      },
    });

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Enhanced prompt for structured output
    const prompt = `
      You are a professional resume reviewer. Analyze the following resume content and provide:

      ---
      OVERALL RATING: [score]/10 - [Excellent/Good/Fair/Poor]
      [Detailed explanation of the overall rating in 1-2 sentences]

      KEY STRENGTHS:
      - [Strength 1]
      - [Strength 2]
      - [Strength 3]

      AREAS FOR IMPROVEMENT:
      - [Area 1 with specific suggestions]
      - [Area 2 with specific suggestions]
      - [Area 3 with specific suggestions]

      CONTENT OPTIMIZATION:
      - [Recommendation 1 with examples]
      - [Recommendation 2 with examples]
      - [Recommendation 3 with examples]

      ATS OPTIMIZATION:
      - [Keyword suggestion 1]
      - [Keyword suggestion 2]
      - [Keyword suggestion 3]

      FORMATTING SUGGESTIONS:
      - [Formatting tip 1]
      - [Formatting tip 2]

      ACTIONABLE NEXT STEPS:
      - [Action 1]
      - [Action 2]
      ---

      Focus on:
      1. Content structure and organization
      2. Keyword optimization for ATS systems
      3. Impactful language and action verbs
      4. Quantifiable achievements
      5. Professional tone and clarity
      6. Missing sections that could strengthen the resume

      Provide your recommendations in clear bullet points with **bolded** important terms.

      Resume Content:
      ${textContent.substring(0, 10000)} // Limiting to first 10k chars
    `;

    const geminiResult = await model.generateContent(prompt);
    const recommendations = (await geminiResult.response.text()).trim();

    // Extract rating from Gemini response
    const ratingMatch = recommendations.match(/OVERALL RATING: (\d+(\.\d+)?)\/10 - (\w+)\n(.*?)(?=\n\n|$)/s);
    const rating = ratingMatch ? {
      score: parseFloat(ratingMatch[1]),
      label: ratingMatch[3],
      description: ratingMatch[4].trim()
    } : null;

    // Prepare data for database
    const dbData = {
      filename: file.name,
      inputText: textContent,
      sentimentLabel: analysisResults.result.sentiment?.document?.label || null,
      sentimentScore: analysisResults.result.sentiment?.document?.score || null,
      emotion: analysisResults.result.emotion?.document?.emotion || null,
      keywords: analysisResults.result.keywords?.map(k => k.text) || [],
      recommendations: recommendations,
      analysisData: analysisResults.result,
      rating: rating
    };

    // Save to database
    await PutDataResumeAnalysis(dbData);

    return NextResponse.json({
      insights: analysisResults.result,
      recommendations: recommendations,
      rating: rating,
      message: 'Resume analyzed successfully!'
    }, { status: 200 });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing your document' },
      { status: 500 }
    );
  }
}