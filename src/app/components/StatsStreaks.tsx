import { useEffect, useState } from "react";
import { Flame, BookOpen, Clock, Trophy, ChartBar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface VocabWord {
  id: string;
  word: string;
  partOfSpeech: string;
  cefrLevel: string;
  createdAt: Date;
}

export function StatsStreaks() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [badges, setBadges] = useState(0);
  const [words, setWords] = useState<VocabWord[]>([]);

  useEffect(() => {
    // Load streak data
    const streak = parseInt(localStorage.getItem("currentStreak") || "0");
    setCurrentStreak(streak);

    // Load vocab data
    const vocabData = localStorage.getItem("magicEnglishVocab");
    if (vocabData) {
      const parsedWords = JSON.parse(vocabData);
      setWords(parsedWords);
      setTotalWords(parsedWords.length);
    }

    // Calculate total time (mock - 2 minutes per word)
    setTotalTime(totalWords * 2);

    // Calculate badges
    let badgeCount = 0;
    if (streak >= 3) badgeCount++;
    if (streak >= 7) badgeCount++;
    if (streak >= 14) badgeCount++;
    if (streak >= 30) badgeCount++;
    if (totalWords >= 10) badgeCount++;
    if (totalWords >= 50) badgeCount++;
    if (totalWords >= 100) badgeCount++;
    setBadges(badgeCount);
  }, [totalWords]);

  // Prepare data for Part of Speech chart
  const posData = words.reduce((acc, word) => {
    const pos = word.partOfSpeech || "unknown";
    acc[pos] = (acc[pos] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(posData).map(([name, value]) => ({
    name: name === "noun" ? "Danh từ" : 
          name === "verb" ? "Động từ" : 
          name === "adjective" ? "Tính từ" : 
          name === "adverb" ? "Trạng từ" : name,
    value,
  }));

  const COLORS = {
    "Danh từ": "#3B82F6",
    "Động từ": "#EF4444",
    "Tính từ": "#A855F7",
    "Trạng từ": "#F59E0B",
  };

  // Prepare data for CEFR level chart
  const cefrData = words.reduce((acc, word) => {
    const level = word.cefrLevel || "Unknown";
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = ["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => ({
    level,
    count: cefrData[level] || 0,
  }));

  const nextMilestone = currentStreak < 7 ? 7 : currentStreak < 14 ? 14 : currentStreak < 30 ? 30 : 60;
  const progressToNextMilestone = (currentStreak / nextMilestone) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-8 space-y-8">
        {/* Streak Hero Section */}
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <CardContent className="py-12 relative z-10">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-block mb-4 animate-bounce">
                <Flame className="w-24 h-24 text-yellow-300" />
              </div>
              
              <div className="mb-4">
                <div className="text-7xl font-bold mb-2">{currentStreak}</div>
                <div className="text-xl tracking-wider uppercase font-semibold">
                  NGÀY LIÊN TỤC
                </div>
              </div>

              <p className="text-2xl mb-6">
                {currentStreak === 0 && "Hãy bắt đầu chuỗi ngày của bạn! 🚀"}
                {currentStreak > 0 && currentStreak < 3 && "Khởi đầu tuyệt vời! Tiếp tục nhé! 💪"}
                {currentStreak >= 3 && currentStreak < 7 && "Bạn đang bùng cháy! 🔥"}
                {currentStreak >= 7 && currentStreak < 14 && "Xuất sắc! Một tuần hoàn hảo! ⭐"}
                {currentStreak >= 14 && currentStreak < 30 && "Không thể tin được! Hai tuần! 🎉"}
                {currentStreak >= 30 && "Huyền thoại! Bạn là nguồn cảm hứng! 👑"}
              </p>

              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Tiến độ đến {nextMilestone} ngày</span>
                  <span className="font-bold">{currentStreak}/{nextMilestone}</span>
                </div>
                <Progress 
                  value={progressToNextMilestone} 
                  className="h-3 bg-white/30"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Total Words Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <BookOpen className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-emerald-600">
                    {totalWords}
                  </div>
                  <div className="text-sm text-gray-500">Từ Đã Học</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {totalWords > 0 ? (
                  <>+{Math.min(totalWords, 12)} tuần này</>
                ) : (
                  "Bắt đầu thêm từ vựng!"
                )}
              </p>
            </CardContent>
          </Card>

          {/* Total Time Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600">
                    {(totalTime / 60).toFixed(1)}h
                  </div>
                  <div className="text-sm text-gray-500">Tổng Thời gian</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                ~{Math.round(totalTime / Math.max(currentStreak, 1))} phút/ngày
              </p>
            </CardContent>
          </Card>

          {/* Badges Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-yellow-600">
                    {badges}
                  </div>
                  <div className="text-sm text-gray-500">Huy Hiệu</div>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:underline">
                Xem Tất cả
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Part of Speech Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Phân tích Từ vựng</CardTitle>
            </CardHeader>
            <CardContent>
              {totalWords > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[entry.name as keyof typeof COLORS] || "#999"}
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Chưa có dữ liệu để hiển thị</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CEFR Level Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Tiến bộ theo Cấp độ CEFR</CardTitle>
            </CardHeader>
            <CardContent>
              {totalWords > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Chưa có dữ liệu để hiển thị</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Achievement Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Thành Tích Đạt Được
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {/* Streak Badges */}
              <BadgeItem
                emoji="🔥"
                label="3 Ngày"
                achieved={currentStreak >= 3}
              />
              <BadgeItem
                emoji="⭐"
                label="7 Ngày"
                achieved={currentStreak >= 7}
              />
              <BadgeItem
                emoji="💎"
                label="14 Ngày"
                achieved={currentStreak >= 14}
              />
              <BadgeItem
                emoji="👑"
                label="30 Ngày"
                achieved={currentStreak >= 30}
              />
              
              {/* Vocab Badges */}
              <BadgeItem
                emoji="📚"
                label="10 Từ"
                achieved={totalWords >= 10}
              />
              <BadgeItem
                emoji="🎯"
                label="50 Từ"
                achieved={totalWords >= 50}
              />
              <BadgeItem
                emoji="🏆"
                label="100 Từ"
                achieved={totalWords >= 100}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BadgeItem({
  emoji,
  label,
  achieved,
}: {
  emoji: string;
  label: string;
  achieved: boolean;
}) {
  return (
    <div
      className={`
        p-4 rounded-lg text-center transition-all
        ${
          achieved
            ? "bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400 shadow-md"
            : "bg-gray-100 border-2 border-gray-300 opacity-40 grayscale"
        }
      `}
    >
      <div className="text-4xl mb-2">{emoji}</div>
      <div className="text-xs font-semibold text-gray-700">{label}</div>
    </div>
  );
}