import { Sparkles, BookOpen, PenTool, ChartBar, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-in fade-in duration-700">
          <div className="inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Chào mừng đến với{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Magic English
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Ứng dụng học tiếng Anh "Tất-cả-trong-một" được hỗ trợ bởi AI. 
            Quản lý từ vựng, kiểm tra ngữ pháp và theo dõi tiến độ - tất cả ở một nơi!
          </p>

          <Button
            onClick={onGetStarted}
            size="lg"
            className="h-14 px-8 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg"
          >
            Bắt đầu học ngay <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 text-emerald-600" />}
            title="Magic Vocab"
            description="Tự động làm giàu từ vựng với AI - chỉ cần nhập từ, AI sẽ điền IPA, nghĩa, ví dụ và cấp độ CEFR."
            color="emerald"
          />
          
          <FeatureCard
            icon={<PenTool className="w-8 h-8 text-blue-600" />}
            title="Grammar Check"
            description="Kiểm tra ngữ pháp và phong cách viết với phản hồi tức thì từ AI. Cải thiện kỹ năng viết mỗi ngày."
            color="blue"
          />
          
          <FeatureCard
            icon={<ChartBar className="w-8 h-8 text-teal-600" />}
            title="Stats & Streaks"
            description="Theo dõi tiến độ với chuỗi ngày học liên tục, biểu đồ phân tích và hệ thống huy hiệu động viên."
            color="teal"
          />
        </div>

        {/* Quick Stats */}
        <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardContent className="py-8">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-emerald-600 mb-2">✨</div>
                <div className="text-2xl font-bold text-gray-900">AI-Powered</div>
                <div className="text-sm text-gray-600">Công nghệ thông minh</div>
              </div>
              
              <div>
                <div className="text-4xl font-bold text-teal-600 mb-2">🎯</div>
                <div className="text-2xl font-bold text-gray-900">All-in-One</div>
                <div className="text-sm text-gray-600">Mọi thứ trong một</div>
              </div>
              
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">🔥</div>
                <div className="text-2xl font-bold text-gray-900">Streak</div>
                <div className="text-sm text-gray-600">Duy trì động lực</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          💡 Mẹo: Học ít nhưng đều đặn mỗi ngày để duy trì chuỗi streak và đạt kết quả tốt nhất!
        </p>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses = {
    emerald: "bg-emerald-100 border-emerald-200 hover:border-emerald-400",
    blue: "bg-blue-100 border-blue-200 hover:border-blue-400",
    teal: "bg-teal-100 border-teal-200 hover:border-teal-400",
  };

  return (
    <Card
      className={`border-2 transition-all hover:shadow-lg ${
        colorClasses[color as keyof typeof colorClasses]
      }`}
    >
      <CardContent className="pt-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}