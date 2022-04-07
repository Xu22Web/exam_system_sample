

<template>
    <face :open="open" @match="handleMatch"></face>
    <div class="p-1">
        <button class="btn" @click="open = !open">摄像头 {{ open ? '开' : '关' }}</button>
    </div>
</template> 

<script setup>
import face from "@/components/face.vue"
import { ref } from "vue";
const open = ref(false)
// 匹配
const handleMatch = (data) => {
    const { status, file } = data
    console.log(data);
}

</script>

<style>
.btn {
    background: rgb(76, 139, 255);
    color: white;
    padding: 5px;
    border-radius: 4px;
}
</style>
