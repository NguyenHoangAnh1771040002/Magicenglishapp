<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Plus, Search, Filter, Volume2, Edit, Trash2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

import Button from './ui/Button.vue';
import Input from './ui/Input.vue';
import Badge from './ui/Badge.vue';
import Card from './ui/Card.vue';
import CardContent from './ui/CardContent.vue';
import Label from './ui/Label.vue';
import Textarea from './ui/Textarea.vue';
import Dialog from './ui/Dialog.vue';
import DialogContent from './ui/DialogContent.vue';
import DialogHeader from './ui/DialogHeader.vue';
import DialogTitle from './ui/DialogTitle.vue';
import DialogFooter from './ui/DialogFooter.vue';
import Select from './ui/Select.vue';
import SelectTrigger from './ui/SelectTrigger.vue';
import SelectValue from './ui/SelectValue.vue';
import SelectContent from './ui/SelectContent.vue';
import SelectItem from './ui/SelectItem.vue';

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

const words = ref<VocabWord[]>([]);
const searchQuery = ref("");
const isAddModalOpen = ref(false);
const isLoading = ref(false);
const expandedCard = ref<string | null>(null);

const newWord = ref({
  word: "",
  ipa: "",
  meaning: "",
  partOfSpeech: "",
  example: "",
  cefrLevel: "",
});

onMounted(() => {
  const saved = localStorage.getItem("magicEnglishVocab");
  if (saved) {
    try {
      words.value = JSON.parse(saved);
    } catch (e) {
      words.value = [];
    }
  }
});

const handleAnalyze = async () => {
  if (!newWord.value.word.trim()) {
    toast.error("Vui lòng nhập từ vựng!");
    return;
  }

  setIsLoading(true);
  try {
    const analysis = await analyzeWord(newWord.value.word);
    newWord.value = {
      ...newWord.value,
      ...analysis,
    } as any;
    toast.success("✨ Phân tích thành công!");
  } catch (error) {
    toast.error("Không thể kết nối AI. Vui lòng thử lại.");
  } finally {
    setIsLoading(false);
  }
};

const handleSave = () => {
  if (!newWord.value.word || !newWord.value.meaning) {
    toast.error("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  const vocabWord: VocabWord = {
    id: Date.now().toString(),
    ...newWord.value,
    createdAt: new Date(),
  } as VocabWord;

  const updatedWords = [vocabWord, ...words.value];
  words.value = updatedWords;
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
  isAddModalOpen.value = false;
  newWord.value = {
    word: "",
    ipa: "",
    meaning: "",
    partOfSpeech: "",
    example: "",
    cefrLevel: "",
  };
};

const handleDelete = (id: string) => {
  const updatedWords = words.value.filter((w) => w.id !== id);
  words.value = updatedWords;
  localStorage.setItem("magicEnglishVocab", JSON.stringify(updatedWords));
  toast.success("Đã xóa từ!");
};

const filteredWords = computed(() =>
  words.value.filter((word) =>
    word.word.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
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

const setIsLoading = (loading: boolean) => {
  isLoading.value = loading;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-16">
    <div class="max-w-7xl mx-auto px-8">
      <!-- Search Bar -->
      <div class="max-w-2xl mx-auto mb-8">
        <div class="relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Tìm kiếm từ vựng của bạn..."
            v-model="searchQuery"
            class="pl-12 h-12 text-base border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
          />
          <Button
            variant="ghost"
            size="sm"
            class="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <Filter class="w-4 h-4 mr-2" />
            Lọc
          </Button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredWords.length === 0 && !searchQuery" class="text-center py-16">
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          Hành trình từ vựng của bạn bắt đầu tại đây!
        </h3>
        <p class="text-gray-500 mb-6">
          Nhấn nút + để thêm từ đầu tiên
        </p>
      </div>

      <!-- Word Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          v-for="word in filteredWords"
          :key="word.id"
          class="group hover:shadow-lg transition-all cursor-pointer border-l-4 hover:border-l-emerald-500"
          @click="expandedCard = expandedCard === word.id ? null : word.id"
        >
          <CardContent class="p-5">
            <!-- Header -->
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-2xl font-bold text-gray-900">
                {{ word.word }}
              </h3>
              <Badge
                :class="`${getPartOfSpeechColor(word.partOfSpeech)} text-white`"
              >
                {{ word.partOfSpeech }}
              </Badge>
            </div>

            <!-- IPA -->
            <div class="flex items-center gap-2 mb-3">
              <span class="text-gray-600 font-mono">{{ word.ipa }}</span>
              <Button variant="ghost" size="icon" class="h-6 w-6">
                <Volume2 class="w-4 h-4 text-gray-400" />
              </Button>
            </div>

            <!-- Meaning -->
            <p class="text-gray-700 leading-relaxed mb-3">
              {{ word.meaning }}
            </p>

            <!-- Footer -->
            <div class="flex items-center justify-between">
              <Badge
                :class="`${getCefrColor(word.cefrLevel)} text-white`"
              >
                {{ word.cefrLevel }}
              </Badge>

              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" class="h-8 w-8">
                  <Edit class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8 text-red-500 hover:text-red-600"
                  @click.stop="handleDelete(word.id)"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>

            <!-- Expanded Example -->
            <div v-if="expandedCard === word.id" class="mt-4 pt-4 border-t border-gray-200">
              <p class="text-sm text-gray-600 italic">
                <span class="font-semibold not-italic">Ví dụ:</span>
                {{ word.example }}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Floating Action Button -->
      <Button
        @click="isAddModalOpen = true"
        class="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-transform hover:scale-110"
        size="icon"
      >
        <Plus class="w-8 h-8" />
      </Button>

      <!-- Add Word Modal -->
      <Dialog v-model:open="isAddModalOpen">
        <DialogContent class="max-w-2xl">
          <DialogHeader>
            <DialogTitle class="text-2xl">Thêm Từ Mới</DialogTitle>
          </DialogHeader>

          <div class="space-y-4">
            <!-- Word Input -->
            <div>
              <Label htmlFor="word">Từ Tiếng Anh</Label>
              <Input
                id="word"
                placeholder="Gõ một từ... (vd: benevolent)"
                v-model="newWord.word"
                class="text-xl h-14 mt-2"
                autofocus
              />
            </div>

            <!-- Analyze Button -->
            <Button
              @click="handleAnalyze"
              :disabled="isLoading || !newWord.word"
              class="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              <template v-if="isLoading">
                <span class="animate-pulse">✨</span> Đang phân tích...
              </template>
              <template v-else>
                ✨ Phân tích Thần kỳ
              </template>
            </Button>

            <!-- Auto-filled Fields -->
            <template v-if="newWord.ipa">
              <div>
                <Label>Phiên âm IPA</Label>
                <Input
                  v-model="newWord.ipa"
                  readonly
                  class="bg-gray-50 mt-2"
                />
              </div>

              <div>
                <Label>Nghĩa tiếng Việt</Label>
                <Textarea
                  v-model="newWord.meaning"
                  class="mt-2"
                  rows="2"
                />
              </div>

              <div>
                <Label>Loại từ</Label>
                <Select
                  v-model="newWord.partOfSpeech"
                >
                  <SelectTrigger class="mt-2">
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
                  v-model="newWord.example"
                  class="mt-2"
                  rows="3"
                />
              </div>

              <div>
                <Label>Cấp độ CEFR</Label>
                <Select
                  v-model="newWord.cefrLevel"
                >
                  <SelectTrigger class="mt-2">
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
            </template>
          </div>

          <DialogFooter>
            <Button variant="ghost" @click="isAddModalOpen = false">
              Hủy
            </Button>
            <Button
              @click="handleSave"
              class="bg-emerald-500 hover:bg-emerald-600"
              :disabled="!newWord.word || !newWord.meaning"
            >
              Lưu vào Sổ tay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>
