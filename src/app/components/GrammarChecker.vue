<script setup lang="ts">
import { ref } from 'vue';
import { Sparkles, Copy, Check } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { useClipboard } from '@vueuse/core';

import Button from './ui/Button.vue';
import Textarea from './ui/Textarea.vue';
import Card from './ui/Card.vue';
import CardContent from './ui/CardContent.vue';
import CardHeader from './ui/CardHeader.vue';
import CardTitle from './ui/CardTitle.vue';
import Badge from './ui/Badge.vue';
import Progress from './ui/Progress.vue';
import Accordion from './ui/Accordion.vue';
import AccordionItem from './ui/AccordionItem.vue';
import AccordionTrigger from './ui/AccordionTrigger.vue';
import AccordionContent from './ui/AccordionContent.vue';

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

const text = ref("");
const isChecking = ref(false);
const result = ref<GrammarResult | null>(null);
const { copy, copied } = useClipboard();

// Mock AI grammar check
const checkGrammar = async (textInput: string): Promise<GrammarResult> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  let score = 8.5;
  const mistakes: GrammarMistake[] = [];

  // Simple mock detection
  if (textInput.includes("go yesterday")) {
    mistakes.push({
      text: "go",
      type: "Grammar",
      suggestion: "went",
      position: textInput.indexOf("go"),
    });
    score -= 1;
  }

  if (textInput.includes("don't got")) {
    mistakes.push({
      text: "don't got",
      type: "Grammar",
      suggestion: "don't have",
      position: textInput.indexOf("don't got"),
    });
    score -= 1.5;
  }

  if (textInput.includes("very good")) {
    mistakes.push({
      text: "very good",
      type: "Style",
      suggestion: "excellent",
      position: textInput.indexOf("very good"),
    });
    score -= 0.5;
  }

  const improvedVersion = textInput
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

const handleCheck = async () => {
  if (text.value.trim().split(" ").length < 5) {
    toast.error("Văn bản quá ngắn để phân tích. Vui lòng viết ít nhất 5 từ.");
    return;
  }

  isChecking.value = true;
  try {
    const grammarResult = await checkGrammar(text.value);
    result.value = grammarResult;

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
    isChecking.value = false;
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
  if (result.value?.improvedVersion) {
    copy(result.value.improvedVersion);
    toast.success("Đã sao chép vào clipboard!");
  }
};

const applyFix = (mistake: GrammarMistake) => {
  const newText = text.value.replace(mistake.text, mistake.suggestion);
  text.value = newText;
  toast.success("Đã áp dụng sửa!");
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-16">
    <div class="max-w-7xl mx-auto px-8">
      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Left Panel - Text Editor -->
        <Card class="lg:sticky lg:top-24 h-fit">
          <CardHeader>
            <CardTitle class="flex items-center justify-between">
              <span>Viết Văn Bản Của Bạn</span>
              <span class="text-sm font-normal text-gray-500">
                {{ text.length }} / 2000
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <Textarea
              placeholder="Bắt đầu viết bằng tiếng Anh... AI sẽ kiểm tra ngay lập tức! ✍️"
              v-model="text"
              :maxlength="2000"
              @input="result = null"
              class="min-h-[400px] text-base leading-loose border-2 focus:border-emerald-500"
            />

            <Button
              @click="handleCheck"
              :disabled="isChecking || text.trim().length === 0"
              class="w-full h-14 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              <template v-if="isChecking">
                <Sparkles class="w-5 h-5 mr-2 animate-pulse" />
                AI đang phân tích...
              </template>
              <template v-else-if="text.trim().length === 0">
                Viết gì đó trước...
              </template>
              <template v-else>
                🎯 Kiểm tra Ngữ pháp Ngay
              </template>
            </Button>
          </CardContent>
        </Card>

        <!-- Right Panel - Results -->
        <div class="space-y-6">
          <Card v-if="!result && !isChecking" class="border-2 border-dashed">
            <CardContent class="py-16 text-center">
              <div class="text-6xl mb-4">📝</div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                Viết gì đó và nhấn 'Kiểm tra'
              </h3>
              <p class="text-gray-500">
                để nhận phản hồi tức thì từ AI!
              </p>
            </CardContent>
          </Card>

          <Card v-if="isChecking">
            <CardContent class="py-16 text-center">
              <div class="inline-block relative mb-4">
                <div class="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
                <Sparkles class="w-6 h-6 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p class="text-lg font-medium">
                AI đang phân tích bài viết của bạn...
              </p>
              <Progress :model-value="45" class="mt-4 max-w-xs mx-auto" />
            </CardContent>
          </Card>

          <template v-if="result">
            <!-- Score Card -->
            <Card>
              <CardContent class="py-8">
                <div class="text-center">
                  <div
                    class="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 mb-4"
                    :class="
                      result.score >= 8
                        ? 'border-emerald-500'
                        : result.score >= 5
                        ? 'border-yellow-500'
                        : 'border-red-500'
                    "
                  >
                    <span
                      class="text-5xl font-bold"
                      :class="getScoreColor(result.score)"
                    >
                      {{ result.score.toFixed(1) }}
                    </span>
                  </div>
                  <h3 class="text-2xl font-bold text-gray-900 mb-2">
                    {{ getScoreMessage(result.score) }}
                  </h3>
                  <p class="text-gray-600">{{ result.feedback }}</p>
                </div>
              </CardContent>
            </Card>

            <!-- Mistakes -->
            <Card v-if="result.mistakes.length > 0">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  Lỗi Tìm Thấy
                  <Badge variant="destructive">
                    {{ result.mistakes.length }}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-3">
                <div
                  v-for="(mistake, index) in result.mistakes"
                  :key="index"
                  class="p-4 bg-red-50 border-l-4 border-red-500 rounded"
                >
                  <div class="flex items-start justify-between mb-2">
                    <Badge
                      :variant="mistake.type === 'Grammar' ? 'destructive' : 'secondary'"
                    >
                      {{ mistake.type }}
                    </Badge>
                  </div>
                  <p class="text-sm mb-2">
                    <span class="line-through text-red-600 font-medium">
                      {{ mistake.text }}
                    </span>
                    <span class="mx-2">→</span>
                    <span class="text-emerald-600 font-medium">
                      {{ mistake.suggestion }}
                    </span>
                  </p>
                  <Button
                    size="sm"
                    @click="applyFix(mistake)"
                    class="bg-emerald-500 hover:bg-emerald-600"
                  >
                    Áp dụng Sửa
                  </Button>
                </div>
              </CardContent>
            </Card>

            <!-- Improved Version -->
            <Card v-if="result.improvedVersion !== text" class="border-2 border-emerald-200">
              <Accordion type="single" collapsible>
                <AccordionItem value="improved" class="border-none">
                  <AccordionTrigger class="px-6 hover:no-underline">
                    <span class="text-lg font-semibold">
                      📝 AI Đề xuất Viết lại
                    </span>
                  </AccordionTrigger>
                  <AccordionContent class="px-6 pb-6">
                    <div class="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-500 mb-4">
                      <p class="text-base leading-relaxed">
                        {{ result.improvedVersion }}
                      </p>
                    </div>
                    <Button
                      @click="handleCopyImproved"
                      variant="outline"
                      class="w-full"
                    >
                      <template v-if="copied">
                        <Check class="w-4 h-4 mr-2" />
                        Đã sao chép!
                      </template>
                      <template v-else>
                        <Copy class="w-4 h-4 mr-2" />
                        Sao chép vào Clipboard
                      </template>
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
