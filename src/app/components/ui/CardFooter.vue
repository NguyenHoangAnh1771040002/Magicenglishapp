<script setup lang="ts">
import { cn } from "@/app/components/ui/utils";

const props = defineProps<{
  class?: string;
}>();
</script>

<template>
  <div :class="cn('flex items-center px-6 pb-6 [.border-t]:pt-6', props.class)">
    <slot />
  </div>
</template>
