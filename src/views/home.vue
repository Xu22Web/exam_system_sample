

<template>
    <face :open="open" @find="handleFind"></face>
    <div class="p-1">
        <button class="btn" @click="open = !open">摄像头 {{ open ? '开' : '关' }}</button>
    </div>
</template> 

<script setup>
import face from "@/components/face.vue"
import axios from 'axios'
import { ref } from "vue";
const open = ref(false)
// 匹配
const handleFind = async (data) => {
    console.log(data);
    const { status, file } = data
    if (status) {
        const form = new FormData()
        form.append('face', file)
        const res = await axios.post("http://api.exam.uu988.xyz/api/face/match", form, {
            headers: {
                'Authorization': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIzVlNvRTVhZzQ1NjM1N250NEozUjQ0a2g2NGMwWXQ2aCIsInV0eXBlIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NDk0MDA3NTAsImV4cCI6MTY0OTQ4NzE1MH0.yxE4wZ2rUGXsQh_Frs33GwfqECCme_74p_F3XTJdepw",
                'Content-Type': 'multipart/form-data',
            },
        })
        console.log(res.data);
    }
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
