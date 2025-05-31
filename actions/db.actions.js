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
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(
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
      await client.query('COMMIT');
      return result.rows[0]; // For neon, use `result[0]`, not `rows[0]`
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Database Error:', error);
        throw error; // Re-throw the error for handling in the calling function
    }   finally {
        client.release();
        }
};

export async function PutDataResumeAnalysis(data) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const insertQuery = `
      INSERT INTO resume_analysis (
        filename,
        input_text,
        sentiment_label,
        sentiment_score,
        emotion_data,
        keywords,
        recommendations,
        analysis_data
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
    
    const result = await client.query(insertQuery, [
      data.filename,
      data.inputText,
      data.sentimentLabel,
      data.sentimentScore,
      data.emotion ? JSON.stringify(data.emotion) : null,
      data.keywords ? JSON.stringify(data.keywords) : null,
      data.recommendations,
      JSON.stringify(data.analysisData)
    ]);
    
    await client.query('COMMIT');
    return result.rows[0].id;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database Error:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function GetResume(){
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM resume_analysis');
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  } finally {
    client.release();
  }
}

