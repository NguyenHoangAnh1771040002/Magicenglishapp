<script setup lang="ts">
import { cn } from "@/app/components/ui/utils";

const props = defineProps<{
  class?: string;
}>();
</script>

<template>
  <div :class="cn('px-6 [&:last-child]:pb-6', props.class)">
    <slot />
  </div>
</template>
