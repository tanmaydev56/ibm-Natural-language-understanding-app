// utils/putDataTextAnalysis.js
import pool from "@/lib/db"
// Pass these as parameters when calling
export const PutDataTextAnalysis = async ({
  inputText,
  sentimentLabel,
  sentimentScore,
  emotion,
  keywords,
}) => {
  const result = await db.query(
    `INSERT INTO text_analysis (
      input_text, 
      sentiment_label, 
      sentiment_score, 
      emotion_anger, 
      emotion_disgust, 
      emotion_fear, 
      emotion_joy, 
      emotion_sadness, 
      keywords
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9
    ) RETURNING *`,
    [
      inputText,
      sentimentLabel,
      sentimentScore,
      emotion?.anger,
      emotion?.disgust,
      emotion?.fear,
      emotion?.joy,
      emotion?.sadness,
      JSON.stringify(keywords),
    ]
  );

  return result[0]; // For neon, use `result[0]`, not `rows[0]`
};

export async function PutDataResumeAnalysis(data) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const insertQuery = `
      INSERT INTO resume_analysis (
        filename,
        input_text,
        analysis_data,
        recommendations,
        analyzed_at
      ) VALUES ($1, $2, $3, $4, NOW())
    `;
    
    await client.query(insertQuery, [
      data.filename,
      data.inputText,
      JSON.stringify(data.analysis),
      data.recommendations
    ]);
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
