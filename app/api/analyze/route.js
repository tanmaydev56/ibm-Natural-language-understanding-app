// app/api/analyze/route.js

import NaturalLanguageUnderstandingV1 from 'ibm-watson/natural-language-understanding/v1';
import { IamAuthenticator } from 'ibm-watson/auth';
import { PutDataTextAnalysis } from '../../../actions/db.actions';

const nlu = new NaturalLanguageUnderstandingV1({
  version: '2021-08-01',
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_API_KEY
  }),
  serviceUrl: process.env.IBM_URL
});

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return Response.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const analysis = await nlu.analyze({
      text,
      features: {
        sentiment: {},
        emotion: {},
        keywords: {
          limit: 3,
          sentiment: true,
          emotion: true
        }
      },
      language: 'en'
    });
    const {sentiment, emotion, keywords} = analysis.result;
    await PutDataTextAnalysis({
      inputText: text,
      sentimentLabel: sentiment.document.label,
      sentimentScore: sentiment.document.score,
      emotion: emotion.document.emotion,
      keywords: keywords.map(keyword => ({
        text: keyword.text,
        sentiment: keyword.sentiment.label,
        emotion: keyword.emotion
      }))
    })
    return Response.json(analysis.result);
    
  } catch (error) {
    console.error('IBM Watson Error:', error);
    return Response.json(
      { 
        error: 'Analysis failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}