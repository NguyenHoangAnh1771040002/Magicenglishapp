import { useState } from "react";
import { Plus, Search, Filter, Volume2, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

interface VocabWord {
  id: string;
  word: string;
  ipa: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
  cefrLevel: string;
  createdAt: Date;
}

// Mock AI response function
const analyzeWord = async (word: string): Promise<Partial<VocabWord>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock data - in real app, this would call Ollama API
  const mockData: Record<string, Partial<VocabWord>> = {
    benevolent: {
      ipa: "/bəˈnev.əl.ənt/",
      meaning: "Nhân từ, rộng lượng, có lòng thương người",
      partOfSpeech: "adjective",
      example: "He was a benevolent old man and wouldn't hurt a fly.",
      cefrLevel: "C1",
    },
    eloquent: {
      ipa: "/ˈel.ə.kwənt/",
      meaning: "Hùng hồn, có tài hùng biện",
      partOfSpeech: "adjective",
      example: "She gave an eloquent speech about climate change.",
      cefrLevel: "C1",
    },
    persevere: {
      ipa: "/ˌpɜː.sɪˈvɪər/",
      meaning: "Kiên trì, bền bỉ",
      partOfSpeech: "verb",
      example: "We must persevere despite the challenges.",
      cefrLevel: "B2",
    },
  };

  return (
    mockData[word.toLowerCase()] || {
      ipa: `/ˈwɜːrd/`,
      meaning: "Định nghĩa của từ",
      partOfSpeech: "noun",
      example: `This is an example sentence using ${word}.`,
      cefrLevel: "B1",
    }
  );
};

export function MagicVocab() {
  const [words, setWords] = useState<VocabWord[]>(() => {
    const saved = localStorage.getItem("magicEnglishVocab");
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const [newWord, setNewWord] = useState({
    word: "",
    ipa: "",
    meaning: "",
    partOfSpeech: "",
    example: "",
    cefrLevel: "",
  });

  const handleAnalyze = async () => {
    if (!newWord.word.trim()) {
      toast.error("Vui lòng nhập từ vựng!");
      return;
    }

    setIsLoading(true);
    try {
      const analysis = await analyzeWord(newWord.word);
      setNewWord((prev) => ({
        ...prev,
        ...analysis,
      }));
      toast.success("✨ Phân tích thành công!");
    } catch (error) {
      toast.error("Không thể kết nối AI. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!newWord.word || !newWord.meaning) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const vocabWord: VocabWord = {
      id: Date.now().toString(),
      ...newWord,
      createdAt: new Date(),
    } as VocabWord;

    const updatedWords = [vocabWord, ...words];
    setWords(updatedWords);
    localStorage.setItem("magicEnglishVocab", JSON.stringify(updatedWords));

    // Update streak
    const today = new Date().toDateString();
    const lastStudyDate = localStorage.getItem("lastStudyDate");
    const currentStreak = parseInt(localStorage.getItem("currentStreak") || "0");

    if (lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = lastStudyDate === yesterday.toDateString();

      localStorage.setItem("lastStudyDate", today);
      localStorage.setItem(
        "currentStreak",
        (isConsecutive ? currentStreak + 1 : 1).toString()
      );
    }

    toast.success("Đã thêm từ thành công! 📚");
    setIsAddModalOpen(false);
    setNewWord({
      word: "",
      ipa: "",
      meaning: "",
      partOfSpeech: "",
      example: "",
      cefrLevel: "",
    });
  };

  const handleDelete = (id: string) => {
    const updatedWords = words.filter((w) => w.id !== id);
    setWords(updatedWords);
    localStorage.setItem("magicEnglishVocab", JSON.stringify(updatedWords));
    toast.success("Đã xóa từ!");
  };

  const filteredWords = words.filter((word) =>
    word.word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPartOfSpeechColor = (pos: string) => {
    const colors: Record<string, string> = {
      noun: "bg-blue-500",
      verb: "bg-red-500",
      adjective: "bg-purple-500",
      adverb: "bg-orange-500",
    };
    return colors[pos] || "bg-gray-500";
  };

  const getCefrColor = (level: string) => {
    const colors: Record<string, string> = {
      A1: "bg-green-500",
      A2: "bg-green-600",
      B1: "bg-yellow-500",
      B2: "bg-yellow-600",
      C1: "bg-red-500",
      C2: "bg-red-600",
    };
    return colors[level] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Tìm kiếm từ vựng của bạn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {filteredWords.length === 0 && !searchQuery && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Hành trình từ vựng của bạn bắt đầu tại đây!
            </h3>
            <p className="text-gray-500 mb-6">
              Nhấn nút + để thêm từ đầu tiên
            </p>
          </div>
        )}

        {/* Word Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWords.map((word) => (
            <Card
              key={word.id}
              className="group hover:shadow-lg transition-all cursor-pointer border-l-4 hover:border-l-emerald-500"
              onClick={() =>
                setExpandedCard(expandedCard === word.id ? null : word.id)
              }
            >
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {word.word}
                  </h3>
                  <Badge
                    className={`${getPartOfSpeechColor(word.partOfSpeech)} text-white`}
                  >
                    {word.partOfSpeech}
                  </Badge>
                </div>

                {/* IPA */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-600 font-mono">{word.ipa}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Volume2 className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>

                {/* Meaning */}
                <p className="text-gray-700 leading-relaxed mb-3">
                  {word.meaning}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <Badge
                    className={`${getCefrColor(word.cefrLevel)} text-white`}
                  >
                    {word.cefrLevel}
                  </Badge>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(word.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Expanded Example */}
                {expandedCard === word.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 italic">
                      <span className="font-semibold not-italic">Ví dụ:</span>{" "}
                      {word.example}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Floating Action Button */}
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-transform hover:scale-110"
          size="icon"
        >
          <Plus className="w-8 h-8" />
        </Button>

        {/* Add Word Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Thêm Từ Mới</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Word Input */}
              <div>
                <Label htmlFor="word">Từ Tiếng Anh</Label>
                <Input
                  id="word"
                  placeholder="Gõ một từ... (vd: benevolent)"
                  value={newWord.word}
                  onChange={(e) =>
                    setNewWord((prev) => ({ ...prev, word: e.target.value }))
                  }
                  className="text-xl h-14 mt-2"
                  autoFocus
                />
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isLoading || !newWord.word}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                {isLoading ? (
                  <>
                    <span className="animate-pulse">✨</span> Đang phân tích...
                  </>
                ) : (
                  <>✨ Phân tích Thần kỳ</>
                )}
              </Button>

              {/* Auto-filled Fields */}
              {newWord.ipa && (
                <>
                  <div>
                    <Label>Phiên âm IPA</Label>
                    <Input
                      value={newWord.ipa}
                      readOnly
                      className="bg-gray-50 mt-2"
                    />
                  </div>

                  <div>
                    <Label>Nghĩa tiếng Việt</Label>
                    <Textarea
                      value={newWord.meaning}
                      onChange={(e) =>
                        setNewWord((prev) => ({
                          ...prev,
                          meaning: e.target.value,
                        }))
                      }
                      className="mt-2"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Loại từ</Label>
                    <Select
                      value={newWord.partOfSpeech}
                      onValueChange={(value) =>
                        setNewWord((prev) => ({ ...prev, partOfSpeech: value }))
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="noun">Danh từ</SelectItem>
                        <SelectItem value="verb">Động từ</SelectItem>
                        <SelectItem value="adjective">Tính từ</SelectItem>
                        <SelectItem value="adverb">Trạng từ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Câu ví dụ</Label>
                    <Textarea
                      value={newWord.example}
                      onChange={(e) =>
                        setNewWord((prev) => ({
                          ...prev,
                          example: e.target.value,
                        }))
                      }
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Cấp độ CEFR</Label>
                    <Select
                      value={newWord.cefrLevel}
                      onValueChange={(value) =>
                        setNewWord((prev) => ({ ...prev, cefrLevel: value }))
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A1">A1 - Beginner</SelectItem>
                        <SelectItem value="A2">A2 - Elementary</SelectItem>
                        <SelectItem value="B1">B1 - Intermediate</SelectItem>
                        <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
                        <SelectItem value="C1">C1 - Advanced</SelectItem>
                        <SelectItem value="C2">C2 - Proficient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                className="bg-emerald-500 hover:bg-emerald-600"
                disabled={!newWord.word || !newWord.meaning}
              >
                Lưu vào Sổ tay
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
