<script setup lang="ts">
import { AvatarFallback, type AvatarFallbackProps } from "radix-vue";
import { cn } from "@/app/components/ui/utils";

const props = defineProps<AvatarFallbackProps & { class?: string }>();
</script>

<template>
  <AvatarFallback
    v-bind="props"
    :class="cn('bg-muted flex size-full items-center justify-center rounded-full', props.class)"
  >
    <slot />
  </AvatarFallback>
</template>
