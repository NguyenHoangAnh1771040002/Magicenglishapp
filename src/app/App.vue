<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Toaster, toast } from 'vue-sonner'
import Navigation from "./components/Navigation.vue";
import WelcomeScreen from "./components/WelcomeScreen.vue";
import MagicVocab from "./components/MagicVocab.vue";
import GrammarChecker from "./components/GrammarChecker.vue";
import StatsStreaks from "./components/StatsStreaks.vue";
import { initializeSampleData, loadSampleData } from "./utils/sampleData";

const activeTab = ref("vocab")
const showWelcome = ref(false)

onMounted(() => {
  const hasVisited = localStorage.getItem("magicEnglishVisited")
  if (!hasVisited) {
    showWelcome.value = true
  }

  // Auto load sample data if missing
  if (initializeSampleData()) {
    loadSampleData();
    
    // If user is already past the welcome screen (meaning MagicVocab is likely mounted with empty data),
    // force a reload to ensure the new data is displayed.
    // If they are on the Welcome screen, MagicVocab hasn't mounted yet, so it will read the data when it does.
    if (hasVisited) {
      window.location.reload();
    }
  }
})

const handleGetStarted = () => {
  localStorage.setItem("magicEnglishVisited", "true")
  showWelcome.value = false
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
    
    <Toaster position="top-right" />
  </div>
</template>
