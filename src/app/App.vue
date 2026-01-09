<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Toaster, toast } from 'vue-sonner'
import Navigation from "./components/Navigation.vue";
import WelcomeScreen from "./components/WelcomeScreen.vue";
import MagicVocab from "./components/MagicVocab.vue";
import GrammarChecker from "./components/GrammarChecker.vue";
import StatsStreaks from "./components/StatsStreaks.vue";
import { initializeSampleData, loadSampleData, skipSampleData } from "./utils/sampleData";

// Dialog components
import Dialog from "./components/ui/Dialog.vue";
import DialogContent from "./components/ui/DialogContent.vue";
import DialogHeader from "./components/ui/DialogHeader.vue";
import DialogTitle from "./components/ui/DialogTitle.vue";
import DialogDescription from "./components/ui/DialogDescription.vue";
import DialogFooter from "./components/ui/DialogFooter.vue";
import Button from "./components/ui/Button.vue";

const activeTab = ref("vocab")
const showWelcome = ref(false)
const showSampleDataDialog = ref(false)

onMounted(() => {
  const hasVisited = localStorage.getItem("magicEnglishVisited")
  if (!hasVisited) {
    showWelcome.value = true
  }

  // Check if we should offering sample data
  if (initializeSampleData()) {
    showSampleDataDialog.value = true;
  }
})

const handleGetStarted = () => {
  localStorage.setItem("magicEnglishVisited", "true")
  showWelcome.value = false
}

const handleLoadSampleData = () => {
  loadSampleData();
  toast.success("Đã tải dữ liệu mẫu thành công!");
  showSampleDataDialog.value = false;
  // Trigger a reload or event to update MagicVocab if needed. 
  // Since MagicVocab reads on mount, it might need a re-mount or watcher.
  // We can force re-render by key or just reload page.
  window.location.reload();
}

const handleSkipSampleData = () => {
  skipSampleData();
  showSampleDataDialog.value = false;
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navigation
      :activeTab="activeTab"
      @tabChange="(tab) => activeTab = tab"
    />
    
    <WelcomeScreen
      v-if="showWelcome"
      @getStarted="handleGetStarted"
    />

    <template v-else>
      <MagicVocab v-if="activeTab === 'vocab'" />
      
      <GrammarChecker v-if="activeTab === 'grammar'" />
      <StatsStreaks v-if="activeTab === 'stats'" />
      
      <div v-if="activeTab !== 'vocab' && activeTab !== 'grammar' && activeTab !== 'stats'" class="pt-20 p-4">
        <h1 class="text-3xl font-bold text-emerald-600 text-center">Work in Progress</h1>
        <p class="text-center mt-4">Active Tab: {{ activeTab }}</p>
      </div>
    </template>
    
    <!-- Sample Data Dialog -->
    <Dialog v-model:open="showSampleDataDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tải dữ liệu mẫu?</DialogTitle>
          <DialogDescription>
            Bạn có muốn tải một số từ vựng mẫu để trải nghiệm ứng dụng ngay lập tức không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" @click="handleSkipSampleData">Không, cảm ơn</Button>
          <Button @click="handleLoadSampleData" class="bg-emerald-500 hover:bg-emerald-600">Tải Dữ Liệu Mẫu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Toaster position="top-right" />
  </div>
</template>
