<script setup lang="ts">
import { AvatarImage, type AvatarImageProps } from "radix-vue";
import { cn } from "@/app/components/ui/utils";

const props = defineProps<AvatarImageProps & { class?: string }>();
</script>

<template>
  <AvatarImage
    v-bind="props"
    :class="cn('aspect-square size-full', props.class)"
  />
</template>
