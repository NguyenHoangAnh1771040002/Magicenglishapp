<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Flame, BookOpen, Clock, Trophy, BarChart3 } from 'lucide-vue-next';
import { Pie, Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';

import Card from './ui/Card.vue';
import CardContent from './ui/CardContent.vue';
import CardHeader from './ui/CardHeader.vue';
import CardTitle from './ui/CardTitle.vue';
import Progress from './ui/Progress.vue';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

interface VocabWord {
  id: string;
  word: string;
  partOfSpeech: string;
  cefrLevel: string;
  createdAt: Date;
}

const currentStreak = ref(0);
const totalWords = ref(0);
const totalTime = ref(0);
const badges = ref(0);
const words = ref<VocabWord[]>([]);

onMounted(() => {
  // Load streak data
  const streak = parseInt(localStorage.getItem("currentStreak") || "0");
  currentStreak.value = streak;

  // Load vocab data
  const vocabData = localStorage.getItem("magicEnglishVocab");
  if (vocabData) {
    try {
      const parsedWords = JSON.parse(vocabData);
      words.value = parsedWords;
      totalWords.value = parsedWords.length;
    } catch (e) {
      words.value = [];
    }
  }

  // Calculate total time (mock - 2 minutes per word)
  totalTime.value = totalWords.value * 2;

  // Calculate badges
  let badgeCount = 0;
  if (streak >= 3) badgeCount++;
  if (streak >= 7) badgeCount++;
  if (streak >= 14) badgeCount++;
  if (streak >= 30) badgeCount++;
  if (totalWords.value >= 10) badgeCount++;
  if (totalWords.value >= 50) badgeCount++;
  if (totalWords.value >= 100) badgeCount++;
  badges.value = badgeCount;
});

// Prepare data for Part of Speech chart
const pieChartData = computed(() => {
  const posData = words.value.reduce((acc, word) => {
    const pos = word.partOfSpeech || "unknown";
    acc[pos] = (acc[pos] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Map English keys to Vietnamese labels for display if desired, or keep as keys.
  // The original has a mapping.
  const labels = Object.keys(posData).map(name => 
    name === "noun" ? "Danh từ" : 
    name === "verb" ? "Động từ" : 
    name === "adjective" ? "Tính từ" : 
    name === "adverb" ? "Trạng từ" : name
  );
  
  const data = Object.values(posData);
  
  const COLORS = {
    "Danh từ": "#3B82F6",
    "Động từ": "#EF4444",
    "Tính từ": "#A855F7",
    "Trạng từ": "#F59E0B",
  };

  const backgroundColor = labels.map(label => COLORS[label as keyof typeof COLORS] || "#999");

  return {
    labels,
    datasets: [
      {
        backgroundColor,
        data
      }
    ]
  };
});

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

// Prepare data for CEFR level chart
const barChartData = computed(() => {
  const cefrData = words.value.reduce((acc, word) => {
    const level = word.cefrLevel || "Unknown";
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const data = levels.map(level => cefrData[level] || 0);

  return {
    labels: levels,
    datasets: [
      {
        label: 'Số từ',
        backgroundColor: '#10B981',
        data,
        borderRadius: 4,
      }
    ]
  };
});

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const nextMilestone = computed(() => 
  currentStreak.value < 7 ? 7 : currentStreak.value < 14 ? 14 : currentStreak.value < 30 ? 30 : 60
);

const progressToNextMilestone = computed(() => 
  (currentStreak.value / nextMilestone.value) * 100
);

const BadgeItem = {
  props: ['emoji', 'label', 'achieved'],
  template: `
    <div :class="[
      'p-4 rounded-lg text-center transition-all',
      achieved
        ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400 shadow-md'
        : 'bg-gray-100 border-2 border-gray-300 opacity-40 grayscale'
    ]">
      <div class="text-4xl mb-2">{{ emoji }}</div>
      <div class="text-xs font-semibold text-gray-700">{{ label }}</div>
    </div>
  `
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-16">
    <div class="max-w-7xl mx-auto px-8 space-y-8">
      <!-- Streak Hero Section -->
      <Card class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 overflow-hidden relative">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <CardContent class="py-12 relative z-10">
          <div class="text-center max-w-2xl mx-auto">
            <div class="inline-block mb-4 animate-bounce">
              <Flame class="w-24 h-24 text-yellow-300" />
            </div>
            
            <div class="mb-4">
              <div class="text-7xl font-bold mb-2">{{ currentStreak }}</div>
              <div class="text-xl tracking-wider uppercase font-semibold">
                NGÀY LIÊN TỤC
              </div>
            </div>

            <p class="text-2xl mb-6">
              <template v-if="currentStreak === 0">Hãy bắt đầu chuỗi ngày của bạn! 🚀</template>
              <template v-else-if="currentStreak > 0 && currentStreak < 3">Khởi đầu tuyệt vời! Tiếp tục nhé! 💪</template>
              <template v-else-if="currentStreak >= 3 && currentStreak < 7">Bạn đang bùng cháy! 🔥</template>
              <template v-else-if="currentStreak >= 7 && currentStreak < 14">Xuất sắc! Một tuần hoàn hảo! ⭐</template>
              <template v-else-if="currentStreak >= 14 && currentStreak < 30">Không thể tin được! Hai tuần! 🎉</template>
              <template v-else>Huyền thoại! Bạn là nguồn cảm hứng! 👑</template>
            </p>

            <div class="max-w-md mx-auto">
              <div class="flex items-center justify-between text-sm mb-2">
                <span>Tiến độ đến {{ nextMilestone }} ngày</span>
                <span class="font-bold">{{ currentStreak }}/{{ nextMilestone }}</span>
              </div>
              <Progress 
                :model-value="progressToNextMilestone" 
                class="h-3 bg-white/30"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Stats Cards Grid -->
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Total Words Card -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardContent class="pt-6">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-emerald-100 rounded-lg">
                <BookOpen class="w-8 h-8 text-emerald-600" />
              </div>
              <div class="text-right">
                <div class="text-4xl font-bold text-emerald-600">
                  {{ totalWords }}
                </div>
                <div class="text-sm text-gray-500">Từ Đã Học</div>
              </div>
            </div>
            <p class="text-sm text-gray-600">
              <template v-if="totalWords > 0">
                +{{ Math.min(totalWords, 12) }} tuần này
              </template>
              <template v-else>
                Bắt đầu thêm từ vựng!
              </template>
            </p>
          </CardContent>
        </Card>

        <!-- Total Time Card -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardContent class="pt-6">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-blue-100 rounded-lg">
                <Clock class="w-8 h-8 text-blue-600" />
              </div>
              <div class="text-right">
                <div class="text-4xl font-bold text-blue-600">
                  {{ (totalTime / 60).toFixed(1) }}h
                </div>
                <div class="text-sm text-gray-500">Tổng Thời gian</div>
              </div>
            </div>
            <p class="text-sm text-gray-600">
              ~{{ Math.round(totalTime / Math.max(currentStreak, 1)) }} phút/ngày
            </p>
          </CardContent>
        </Card>

        <!-- Badges Card -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardContent class="pt-6">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-yellow-100 rounded-lg">
                <Trophy class="w-8 h-8 text-yellow-600" />
              </div>
              <div class="text-right">
                <div class="text-4xl font-bold text-yellow-600">
                  {{ badges }}
                </div>
                <div class="text-sm text-gray-500">Huy Hiệu</div>
              </div>
            </div>
            <button class="text-sm text-blue-600 hover:underline">
              Xem Tất cả
            </button>
          </CardContent>
        </Card>
      </div>

      <!-- Charts Section -->
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Part of Speech Distribution -->
        <Card>
          <CardHeader>
            <CardTitle>Phân tích Từ vựng</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="totalWords > 0" class="h-[300px]">
              <Pie :data="pieChartData" :options="pieChartOptions" />
            </div>
            <div v-else class="h-[300px] flex items-center justify-center text-gray-400">
              <div class="text-center">
                <BookOpen class="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Chưa có dữ liệu để hiển thị</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- CEFR Level Progress -->
        <Card>
          <CardHeader>
            <CardTitle>Tiến bộ theo Cấp độ CEFR</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="totalWords > 0" class="h-[300px]">
              <Bar :data="barChartData" :options="barChartOptions" />
            </div>
            <div v-else class="h-[300px] flex items-center justify-center text-gray-400">
              <div class="text-center">
                <BarChart3 class="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Chưa có dữ liệu để hiển thị</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Achievement Badges Section -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Trophy class="w-6 h-6 text-yellow-500" />
            Thành Tích Đạt Được
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <!-- Streak Badges -->
            <component :is="BadgeItem" emoji="🔥" label="3 Ngày" :achieved="currentStreak >= 3" />
            <component :is="BadgeItem" emoji="⭐" label="7 Ngày" :achieved="currentStreak >= 7" />
            <component :is="BadgeItem" emoji="💎" label="14 Ngày" :achieved="currentStreak >= 14" />
            <component :is="BadgeItem" emoji="👑" label="30 Ngày" :achieved="currentStreak >= 30" />
            
            <!-- Vocab Badges -->
            <component :is="BadgeItem" emoji="📚" label="10 Từ" :achieved="totalWords >= 10" />
            <component :is="BadgeItem" emoji="🎯" label="50 Từ" :achieved="totalWords >= 50" />
            <component :is="BadgeItem" emoji="🏆" label="100 Từ" :achieved="totalWords >= 100" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
