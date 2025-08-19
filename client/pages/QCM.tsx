import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useSound } from "@/hooks/use-sound";
import { useHaptic } from "@/hooks/use-haptic";
import { useLanguage, type Language } from "@/hooks/use-language.tsx";
import { getQuestionsForProfile, type QCMQuestion } from "@/data/qcm-questions";

export default function QCM() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState<QCMQuestion[]>([]);
  const navigate = useNavigate();
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const certificateButtonRef = useRef<HTMLButtonElement>(null);

  // Language and UX/UI hooks
  const { language, t } = useLanguage();
  const {
    playClickSound,
    playBeepSound,
    playSuccessSound,
    playErrorSound,
    playConfirmSound,
  } = useSound();
  const { triggerLight, triggerMedium, triggerSuccess, triggerError } =
    useHaptic();

  useEffect(() => {
    playBeepSound(); // Entry sound

    // Get user profile and generate questions
    const selectedProfile =
      sessionStorage.getItem("selectedProfile") || "driver";
    const profileQuestions = getQuestionsForProfile(selectedProfile);
    setQuestions(profileQuestions);
  }, [playBeepSound]);

  const handleAnswerSelect = (answerIndex: number) => {
    playClickSound();
    triggerLight();
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);

      const isCorrect = selectedAnswer === questions[currentQuestion].correct;

      if (isCorrect) {
        playSuccessSound();
        triggerSuccess(nextButtonRef.current || undefined);
      } else {
        playErrorSound();
        triggerError(nextButtonRef.current || undefined);
      }

      setShowResult(true);

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setShowResult(false);
          playBeepSound(); // Next question sound
        } else {
          setIsFinished(true);
          playConfirmSound(); // Quiz finished sound
        }
      }, 2000);
    }
  };

  const handleCertificate = () => {
    playConfirmSound();
    triggerSuccess(certificateButtonRef.current || undefined);
    setTimeout(() => {
      navigate("/certificate");
    }, 300);
  };

  const handleBack = () => {
    playClickSound();
    triggerLight();
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correct ? 1 : 0);
    }, 0);
  };

  const scorePercentage = isFinished
    ? Math.round((calculateScore() / questions.length) * 100)
    : 0;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="min-h-screen flex flex-col items-center justify-center px-6 animate-fade-in-up">
          <Card className="bg-slate-800/50 border-slate-600/50 shadow-2xl p-8 max-w-2xl w-full mx-auto text-center terminal-glow animate-scale-in backdrop-blur-md">
            <CardContent className="p-0">
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 animate-bounce-soft ${scorePercentage >= 70 ? "bg-emerald-500" : "bg-orange-500"}`}
              >
                {scorePercentage >= 70 ? (
                  <CheckCircle className="w-10 h-10 text-white" />
                ) : (
                  <XCircle className="w-10 h-10 text-white" />
                )}
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">
                {t("qcm.finished")}
              </h1>

              <div className="mb-6">
                <div
                  className={`text-6xl font-bold mb-2 ${scorePercentage >= 70 ? "text-emerald-400" : "text-orange-400"}`}
                >
                  {scorePercentage}%
                </div>
                <p className="text-slate-300">
                  {t("qcm.score")} {calculateScore()} / {questions.length}
                </p>
              </div>

              <p
                className={`text-lg mb-8 ${scorePercentage >= 70 ? "text-emerald-400" : "text-orange-400"}`}
              >
                {scorePercentage >= 70 ? t("qcm.passed") : t("qcm.failed")}
              </p>

              <Button
                ref={certificateButtonRef}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white px-8 py-4 text-lg font-semibold rounded-xl pulse-button hover-lift interactive-element focus-ring"
                onClick={handleCertificate}
              >
                {t("qcm.certificate")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white">Chargement des questions...</div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correct;

  // Get question text with fallback to French if current language not available
  const getQuestionText = (questionObj: any) => {
    return (
      questionObj[language as keyof typeof questionObj] ||
      questionObj.fr ||
      Object.values(questionObj)[0] ||
      ""
    );
  };

  // Get options with fallback to French if current language not available
  const getQuestionOptions = (optionsObj: any) => {
    return (
      optionsObj[language as keyof typeof optionsObj] ||
      optionsObj.fr ||
      Object.values(optionsObj)[0] ||
      []
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <Link to="/safety-course" onClick={handleBack}>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 interactive-element focus-ring"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("nav.back")}
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-3xl w-full">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-emerald-300 font-medium">
                {t("qcm.question")} {currentQuestion + 1} {t("qcm.of")}{" "}
                {questions.length}
              </span>
              <span className="text-emerald-300 font-medium">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500 animate-progress-fill"
                style={
                  {
                    "--progress-width": `${((currentQuestion + 1) / questions.length) * 100}%`,
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  } as any
                }
              />
            </div>
          </div>

          <Card className="bg-slate-800/50 border-slate-600/50 shadow-2xl terminal-glow animate-scale-in backdrop-blur-md">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-8 animate-fade-in-up">
                {getQuestionText(question.question)}
              </h2>

              <div
                className="space-y-4 mb-8 animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                {getQuestionOptions(question.options).map((option, index) => {
                  let buttonClass =
                    "w-full p-4 text-left border-2 rounded-xl transition-all duration-200 ";

                  if (showResult) {
                    if (index === question.correct) {
                      buttonClass +=
                        "border-emerald-500 bg-emerald-500/20 text-emerald-300";
                    } else if (
                      index === selectedAnswer &&
                      selectedAnswer !== question.correct
                    ) {
                      buttonClass +=
                        "border-red-500 bg-red-500/20 text-red-300";
                    } else {
                      buttonClass +=
                        "border-slate-600 bg-slate-700/50 text-slate-400";
                    }
                  } else {
                    if (selectedAnswer === index) {
                      buttonClass +=
                        "border-emerald-500 bg-emerald-500/20 text-white";
                    } else {
                      buttonClass +=
                        "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-600/50";
                    }
                  }

                  return (
                    <button
                      key={index}
                      className={`${buttonClass} interactive-element focus-ring smooth-transition`}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 border-2 border-current rounded-full mr-4 flex items-center justify-center">
                          {selectedAnswer === index && (
                            <div className="w-3 h-3 bg-current rounded-full" />
                          )}
                        </div>
                        {option}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div
                  className={`p-4 rounded-lg mb-6 animate-fade-in-up ${isCorrect ? "bg-emerald-500/20 border border-emerald-500/50" : "bg-red-500/20 border border-red-500/50"}`}
                >
                  <p
                    className={`font-semibold ${isCorrect ? "text-emerald-300" : "text-red-300"}`}
                  >
                    {isCorrect
                      ? `✅ ${t("qcm.correct")}`
                      : `❌ ${t("qcm.incorrect")}`}
                  </p>
                  {!isCorrect && (
                    <div className="text-slate-300 mt-2">
                      <p>
                        {t("qcm.correctAnswer")}{" "}
                        {getQuestionOptions(question.options)[question.correct]}
                      </p>
                      {question.explanation && (
                        <p className="text-sm mt-2 italic">
                          {getQuestionText(question.explanation)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div
                className="flex justify-end animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                <Button
                  ref={nextButtonRef}
                  onClick={handleNext}
                  disabled={selectedAnswer === null || showResult}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white px-6 py-3 interactive-element focus-ring hover-lift"
                >
                  {currentQuestion === questions.length - 1
                    ? t("nav.finish")
                    : t("nav.next")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress indicator */}
        <div className="mt-12 flex items-center justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
          </div>
          <span className="text-slate-200 text-sm ml-4 font-medium">
            Étape 4 sur 5
          </span>
        </div>
      </div>
    </div>
  );
}
