<script setup lang="ts">
import { ref } from "vue";
import { BookOpen, PenTool, BarChart3, Settings, Menu, X } from "lucide-vue-next";
import Button from "./ui/Button.vue";
import Avatar from "./ui/Avatar.vue";
import AvatarFallback from "./ui/AvatarFallback.vue";

const props = defineProps<{
  activeTab: string;
}>();

const emit = defineEmits<{
  (e: "tabChange", tab: string): void;
}>();

const mobileMenuOpen = ref(false);

const tabs = [
  { id: "vocab", label: "Magic Vocab", icon: BookOpen },
  { id: "grammar", label: "Grammar Check", icon: PenTool },
  { id: "stats", label: "Stats & Streaks", icon: BarChart3 },
];

const handleTabClick = (tabId: string) => {
  emit("tabChange", tabId);
  mobileMenuOpen.value = false;
};
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 md:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <BookOpen class="w-5 h-5 text-white" />
          </div>
          <span class="font-bold text-xl text-gray-900">Magic English</span>
        </div>

        <!-- Desktop Navigation Tabs -->
        <div class="hidden md:flex items-center gap-2">
          <Button
            v-for="tab in tabs"
            :key="tab.id"
            :variant="activeTab === tab.id ? 'default' : 'ghost'"
            @click="emit('tabChange', tab.id)"
            :class="
              activeTab === tab.id
                ? 'bg-emerald-500 hover:bg-emerald-600'
                : ''
            "
          >
            <component :is="tab.icon" class="w-4 h-4 mr-2" />
            {{ tab.label }}
          </Button>
        </div>

        <!-- User Section -->
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="icon" class="hidden md:flex">
            <Settings class="w-5 h-5" />
          </Button>
          <Avatar class="hidden md:flex">
            <AvatarFallback class="bg-emerald-100 text-emerald-700">
              ME
            </AvatarFallback>
          </Avatar>
          
          <!-- Mobile Menu Button -->
          <Button
            variant="ghost"
            size="icon"
            class="md:hidden"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <X v-if="mobileMenuOpen" class="w-6 h-6" />
            <Menu v-else class="w-6 h-6" />
          </Button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden pb-4 space-y-2">
        <Button
          v-for="tab in tabs"
          :key="tab.id"
          :variant="activeTab === tab.id ? 'default' : 'ghost'"
          @click="handleTabClick(tab.id)"
          :class="`w-full justify-start ${
            activeTab === tab.id
              ? 'bg-emerald-500 hover:bg-emerald-600'
              : ''
          }`"
        >
          <component :is="tab.icon" class="w-4 h-4 mr-2" />
          {{ tab.label }}
        </Button>
      </div>
    </div>
  </nav>
</template>
