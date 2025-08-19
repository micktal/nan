import { useEffect, useState } from 'react';
import { getQuestionsForProfile } from '@/data/qcm-questions';

export function QCMTest() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Set a test profile in sessionStorage
      sessionStorage.setItem('selectedProfile', 'driver');
      
      // Try to load questions
      const testQuestions = getQuestionsForProfile('driver');
      setQuestions(testQuestions);
      console.log('Questions loaded successfully:', testQuestions.length, 'questions');
      
      // Test if first question has all required properties
      if (testQuestions.length > 0) {
        const firstQuestion = testQuestions[0];
        console.log('First question:', {
          id: firstQuestion.id,
          hasQuestion: !!firstQuestion.question,
          hasOptions: !!firstQuestion.options,
          hasFrench: !!firstQuestion.question?.fr,
          hasEnglish: !!firstQuestion.question?.en,
          optionsFr: firstQuestion.options?.fr?.length || 0,
          optionsEn: firstQuestion.options?.en?.length || 0
        });
      }
    } catch (err) {
      console.error('Error loading questions:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  return (
    <div className="p-4 bg-slate-800 text-white">
      <h3>QCM Test Component</h3>
      {error ? (
        <div className="text-red-400">Error: {error}</div>
      ) : (
        <div className="text-green-400">
          ✅ Questions loaded successfully: {questions.length} questions
        </div>
      )}
    </div>
  );
}
