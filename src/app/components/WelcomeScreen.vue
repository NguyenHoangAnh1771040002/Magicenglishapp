<script setup lang="ts">
import { Sparkles, BookOpen, PenTool, BarChart3, ArrowRight } from "lucide-vue-next";
import Button from "./ui/Button.vue";
import Card from "./ui/Card.vue";
import CardContent from "./ui/CardContent.vue";

const emit = defineEmits<{
  (e: "getStarted"): void;
}>();

const colorClasses = {
  emerald: "bg-emerald-100 border-emerald-200 hover:border-emerald-400",
  blue: "bg-blue-100 border-blue-200 hover:border-blue-400",
  teal: "bg-teal-100 border-teal-200 hover:border-teal-400",
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-24 pb-16">
    <div class="max-w-6xl mx-auto px-4 md:px-8">
      <!-- Hero Section -->
      <div class="text-center mb-16 animate-in fade-in duration-700">
        <div class="inline-block mb-6">
          <div class="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl">
            <Sparkles class="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Chào mừng đến với
          <span class="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Magic English
          </span>
        </h1>
        
        <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Ứng dụng học tiếng Anh "Tất-cả-trong-một" được hỗ trợ bởi AI. 
          Quản lý từ vựng, kiểm tra ngữ pháp và theo dõi tiến độ - tất cả ở một nơi!
        </p>

        <Button
          @click="emit('getStarted')"
          size="lg"
          class="h-14 px-8 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg"
        >
          Bắt đầu học ngay <ArrowRight class="ml-2 w-5 h-5" />
        </Button>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <Card :class="`border-2 transition-all hover:shadow-lg ${colorClasses.emerald}`">
          <CardContent class="pt-6">
            <div class="mb-4">
              <BookOpen class="w-8 h-8 text-emerald-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Magic Vocab</h3>
            <p class="text-gray-600 leading-relaxed">
              Tự động làm giàu từ vựng với AI - chỉ cần nhập từ, AI sẽ điền IPA, nghĩa, ví dụ và cấp độ CEFR.
            </p>
          </CardContent>
        </Card>
        
        <Card :class="`border-2 transition-all hover:shadow-lg ${colorClasses.blue}`">
          <CardContent class="pt-6">
            <div class="mb-4">
              <PenTool class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Grammar Check</h3>
            <p class="text-gray-600 leading-relaxed">
              Kiểm tra ngữ pháp và phong cách viết với phản hồi tức thì từ AI. Cải thiện kỹ năng viết mỗi ngày.
            </p>
          </CardContent>
        </Card>
        
        <Card :class="`border-2 transition-all hover:shadow-lg ${colorClasses.teal}`">
          <CardContent class="pt-6">
            <div class="mb-4">
              <BarChart3 class="w-8 h-8 text-teal-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Stats & Streaks</h3>
            <p class="text-gray-600 leading-relaxed">
              Theo dõi tiến độ với chuỗi ngày học liên tục, biểu đồ phân tích và hệ thống huy hiệu động viên.
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Quick Stats -->
      <Card class="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardContent class="py-8">
          <div class="grid grid-cols-3 gap-8 text-center">
            <div>
              <div class="text-4xl font-bold text-emerald-600 mb-2">✨</div>
              <div class="text-2xl font-bold text-gray-900">AI-Powered</div>
              <div class="text-sm text-gray-600">Công nghệ thông minh</div>
            </div>
            
            <div>
              <div class="text-4xl font-bold text-teal-600 mb-2">🎯</div>
              <div class="text-2xl font-bold text-gray-900">All-in-One</div>
              <div class="text-sm text-gray-600">Mọi thứ trong một</div>
            </div>
            
            <div>
              <div class="text-4xl font-bold text-blue-600 mb-2">🔥</div>
              <div class="text-2xl font-bold text-gray-900">Streak</div>
              <div class="text-sm text-gray-600">Duy trì động lực</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Footer Note -->
      <p class="text-center text-sm text-gray-500 mt-8">
        💡 Mẹo: Học ít nhưng đều đặn mỗi ngày để duy trì chuỗi streak và đạt kết quả tốt nhất!
      </p>
    </div>
  </div>
</template>
