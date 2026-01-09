<script setup lang="ts">
import { cn } from "@/app/components/ui/utils";

const props = defineProps<{
  class?: string;
}>();
</script>

<template>
  <p :class="cn('text-muted-foreground', props.class)">
    <slot />
  </p>
</template>
