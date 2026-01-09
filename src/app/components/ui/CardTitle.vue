<script setup lang="ts">
import { cn } from "@/app/components/ui/utils";

const props = defineProps<{
  class?: string;
}>();
</script>

<template>
  <h4 :class="cn('leading-none', props.class)">
    <slot />
  </h4>
</template>
