<script setup lang="ts">
import { AvatarRoot } from "radix-vue";
import { cn } from "@/app/components/ui/utils";

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <AvatarRoot
    :class="cn('relative flex size-10 shrink-0 overflow-hidden rounded-full', $attrs.class as string)"
    v-bind="$attrs"
  >
    <slot />
  </AvatarRoot>
</template>
