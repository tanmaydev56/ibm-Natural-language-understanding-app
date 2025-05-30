// app/api/analyze/route.js
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

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
      }
    });

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