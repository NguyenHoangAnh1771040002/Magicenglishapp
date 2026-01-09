import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface GrammarMistake {
  text: string;
  type: string;
  suggestion: string;
  position: number;
}

interface GrammarResult {
  score: number;
  mistakes: GrammarMistake[];
  improvedVersion: string;
  feedback: string;
}

// Mock AI grammar check
const checkGrammar = async (text: string): Promise<GrammarResult> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock analysis
  const wordCount = text.split(" ").length;
  let score = 8.5;
  const mistakes: GrammarMistake[] = [];

  // Simple mock detection
  if (text.includes("go yesterday")) {
    mistakes.push({
      text: "go",
      type: "Grammar",
      suggestion: "went",
      position: text.indexOf("go"),
    });
    score -= 1;
  }

  if (text.includes("don't got")) {
    mistakes.push({
      text: "don't got",
      type: "Grammar",
      suggestion: "don't have",
      position: text.indexOf("don't got"),
    });
    score -= 1.5;
  }

  if (text.includes("very good")) {
    mistakes.push({
      text: "very good",
      type: "Style",
      suggestion: "excellent",
      position: text.indexOf("very good"),
    });
    score -= 0.5;
  }

  const improvedVersion = text
    .replace("go yesterday", "went yesterday")
    .replace("don't got", "don't have")
    .replace("very good", "excellent");

  let feedback = "";
  if (score >= 8) {
    feedback = "Làm tốt lắm! Bài viết của bạn rất tự nhiên.";
  } else if (score >= 6) {
    feedback = "Tốt! Một vài điểm cần cải thiện.";
  } else {
    feedback = "Cần luyện tập thêm. Hãy xem gợi ý bên dưới.";
  }

  return {
    score: Math.max(0, Math.min(10, score)),
    mistakes,
    improvedVersion,
    feedback,
  };
};

export function GrammarChecker() {
  const [text, setText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<GrammarResult | null>(null);
  const [copiedImproved, setCopiedImproved] = useState(false);

  const handleCheck = async () => {
    if (text.trim().split(" ").length < 5) {
      toast.error("Văn bản quá ngắn để phân tích. Vui lòng viết ít nhất 5 từ.");
      return;
    }

    setIsChecking(true);
    try {
      const grammarResult = await checkGrammar(text);
      setResult(grammarResult);

      // Update streak
      const today = new Date().toDateString();
      const lastStudyDate = localStorage.getItem("lastStudyDate");
      if (lastStudyDate !== today) {
        localStorage.setItem("lastStudyDate", today);
        const currentStreak = parseInt(
          localStorage.getItem("currentStreak") || "0"
        );
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutive = lastStudyDate === yesterday.toDateString();
        localStorage.setItem(
          "currentStreak",
          (isConsecutive ? currentStreak + 1 : 1).toString()
        );
      }

      toast.success("✅ Phân tích hoàn tất!");
    } catch (error) {
      toast.error("Không thể kết nối AI. Vui lòng thử lại.");
    } finally {
      setIsChecking(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-500";
    if (score >= 5) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 8) return "Xuất sắc!";
    if (score >= 6) return "Tốt!";
    if (score >= 4) return "Khá!";
    return "Cần cải thiện";
  };

  const handleCopyImproved = () => {
    if (result?.improvedVersion) {
      navigator.clipboard.writeText(result.improvedVersion);
      setCopiedImproved(true);
      toast.success("Đã sao chép vào clipboard!");
      setTimeout(() => setCopiedImproved(false), 2000);
    }
  };

  const applyFix = (mistake: GrammarMistake) => {
    const newText = text.replace(mistake.text, mistake.suggestion);
    setText(newText);
    toast.success("Đã áp dụng sửa!");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Text Editor */}
          <Card className="lg:sticky lg:top-24 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Viết Văn Bản Của Bạn</span>
                <span className="text-sm font-normal text-gray-500">
                  {text.length} / 2000
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Bắt đầu viết bằng tiếng Anh... AI sẽ kiểm tra ngay lập tức! ✍️"
                value={text}
                onChange={(e) => {
                  if (e.target.value.length <= 2000) {
                    setText(e.target.value);
                    setResult(null);
                  }
                }}
                className="min-h-[400px] text-base leading-loose border-2 focus:border-emerald-500"
              />

              <Button
                onClick={handleCheck}
                disabled={isChecking || text.trim().length === 0}
                className="w-full h-14 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                {isChecking ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                    AI đang phân tích...
                  </>
                ) : text.trim().length === 0 ? (
                  "Viết gì đó trước..."
                ) : (
                  <>
                    🎯 Kiểm tra Ngữ pháp Ngay
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            {!result && !isChecking && (
              <Card className="border-2 border-dashed">
                <CardContent className="py-16 text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Viết gì đó và nhấn 'Kiểm tra'
                  </h3>
                  <p className="text-gray-500">
                    để nhận phản hồi tức thì từ AI!
                  </p>
                </CardContent>
              </Card>
            )}

            {isChecking && (
              <Card>
                <CardContent className="py-16 text-center">
                  <div className="inline-block relative mb-4">
                    <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
                    <Sparkles className="w-6 h-6 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-lg font-medium">
                    AI đang phân tích bài viết của bạn...
                  </p>
                  <Progress value={45} className="mt-4 max-w-xs mx-auto" />
                </CardContent>
              </Card>
            )}

            {result && (
              <>
                {/* Score Card */}
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center">
                      <div
                        className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-8 ${
                          result.score >= 8
                            ? "border-emerald-500"
                            : result.score >= 5
                            ? "border-yellow-500"
                            : "border-red-500"
                        } mb-4`}
                      >
                        <span
                          className={`text-5xl font-bold ${getScoreColor(
                            result.score
                          )}`}
                        >
                          {result.score.toFixed(1)}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {getScoreMessage(result.score)}
                      </h3>
                      <p className="text-gray-600">{result.feedback}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Mistakes */}
                {result.mistakes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Lỗi Tìm Thấy
                        <Badge variant="destructive">
                          {result.mistakes.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.mistakes.map((mistake, index) => (
                        <div
                          key={index}
                          className="p-4 bg-red-50 border-l-4 border-red-500 rounded"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge
                              variant={
                                mistake.type === "Grammar"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {mistake.type}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">
                            <span className="line-through text-red-600 font-medium">
                              {mistake.text}
                            </span>
                            <span className="mx-2">→</span>
                            <span className="text-emerald-600 font-medium">
                              {mistake.suggestion}
                            </span>
                          </p>
                          <Button
                            size="sm"
                            onClick={() => applyFix(mistake)}
                            className="bg-emerald-500 hover:bg-emerald-600"
                          >
                            Áp dụng Sửa
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Improved Version */}
                {result.improvedVersion !== text && (
                  <Card className="border-2 border-emerald-200">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="improved" className="border-none">
                        <AccordionTrigger className="px-6 hover:no-underline">
                          <span className="text-lg font-semibold">
                            📝 AI Đề xuất Viết lại
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-500 mb-4">
                            <p className="text-base leading-relaxed">
                              {result.improvedVersion}
                            </p>
                          </div>
                          <Button
                            onClick={handleCopyImproved}
                            variant="outline"
                            className="w-full"
                          >
                            {copiedImproved ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Đã sao chép!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Sao chép vào Clipboard
                              </>
                            )}
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
