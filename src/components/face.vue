<template>
  <div class="relative w-320 h-320 text-base">
    <div class="relative w-320 h-320" v-if="!error && open">
      <video class="bg-black w-full h-full object-cover" autoplay="autoplay" ref="video"></video>
      <canvas
        class="absolute left-0 top-0 w-full h-full text-20"
        ref="canvas"
        width="320"
        height="320"
      ></canvas>
      <canvas
        class="absolute left-0 top-0"
        style="display: none;"
        ref="imgCanvas"
        width="320"
        height="320"
      ></canvas>
      <div
        :class="`absolute right-0 bottom-0 text-white p-10 ${match && 'text-green'}`"
        v-show="!loading"
      >{{ match ? '已检测到人脸' : '未检测到人脸' }}</div>
      <div
        class="absolute left-0 top-0 w-full h-full grid-center bg-black bg-opacity-75"
        v-show="loading"
      >
        <div class="flex-center flex-col">
          <div class="w-30 h-30">
            <svg
              class="animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <div class="text-white pt-10">加载依赖</div>
        </div>
      </div>
    </div>
    <div
      class="absolute w-320 h-320 bg-black left-0 top-0 flex-center text-white"
      v-else-if="!open"
    >
      <div class="w-30 h-30">
        <svg
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path
            d="M106.912 152.096A32 32 0 1 1 149.12 103.904l768 672a32 32 0 0 1-42.176 48.192l-768-672z"
          />
          <path
            d="M732.672 462.4l-37.056-52.16 172.416-122.432a64 64 0 0 1 101.056 51.648l2.624 302.592a63.904 63.904 0 0 1-20.16 47.2l-43.84-46.656-2.624-302.592-172.416 122.432z m-34.72-54.016l35.616 53.184c-10.752 7.2-24.32 12.16-37.216 12.16a64 64 0 0 1-64-64V288a32 32 0 0 0-32-32h-205.952V192h205.952a96 96 0 0 1 96 96v121.28c0.416-0.224 1.088-0.544 1.6-0.896zM632.32 608h64v97.376a96 96 0 0 1-96 96H144a96 96 0 0 1-96-96V288a96 96 0 0 1 96-96h96v64h-96a32 32 0 0 0-32 32v417.376a32 32 0 0 0 32 32h456.32a32 32 0 0 0 32-32V608z"
          />
        </svg>
      </div>
      <div class="pl-10">摄像头未打开</div>
    </div>
    <div
      class="absolute w-320 h-320 bg-black left-0 top-0 flex-center text-white"
      v-else-if="error"
    >
      <div class="w-30 h-30">
        <svg
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path
            d="M475.428571 877.714286C256 877.714286 73.142857 694.857143 73.142857 475.428571S256 73.142857 475.428571 73.142857 877.714286 256 877.714286 475.428571 694.857143 877.714286 475.428571 877.714286m0-877.714286C212.114286 0 0 212.114286 0 475.428571S212.114286 950.857143 475.428571 950.857143 950.857143 738.742857 950.857143 475.428571 738.742857 0 475.428571 0m0 219.428571c-21.942857 0-36.571429 14.628571-36.571428 36.571429v292.571429c0 21.942857 14.628571 36.571429 36.571428 36.571428s36.571429-14.628571 36.571429-36.571428v-292.571429c0-21.942857-14.628571-36.571429-36.571429-36.571429m0 438.857143c-21.942857 0-36.571429 14.628571-36.571428 36.571429s14.628571 36.571429 36.571428 36.571428 36.571429-14.628571 36.571429-36.571428-14.628571-36.571429-36.571429-36.571429"
          />
        </svg>
      </div>
      <div class="pl-10">摄像头打开失败</div>
    </div>
  </div>
  <img src alt id="img" class="w-320 h-320" />
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
import * as faceapi from 'face-api.js';
// 视频
const video = ref(null)
// 画布
const canvas = ref(null)
// 图片画布
const imgCanvas = ref(null)
// 加载模型
const loading = ref(true)
// 匹配
const match = ref(false)
const matchOnce = ref(false)
// 错误
const error = ref(false)
// 媒体流
let mediaStream;
// 可信度
const minConfidence = 0.65
// 属性
const props = defineProps({
  /**
   * @description 开关
   */
  open: {
    type: Boolean,
    default: false
  },
  /**
   * @description 输出图片类型
   */
  mimetype: {
    type: String,
    default: "image/png"
  },
  /**
   * @description 延迟
   */
  delay: {
    type: Number,
    default: 5000
  }
})
// 摄像头状态
const { open, mimetype, delay } = toRefs(props)

// 事件触发
const emits = defineEmits(['media', 'error', 'match', 'find', 'loadMod'])
// open
watch(open, (open) => {
  if (!error.value) {
    if (open) {
      openMedia()
    } else {
      match.value = false
      matchOnce.value = false
      closeMedia()
    }
  }

})
// 加载依赖
const initMod = async () => {
  if (!faceapi.nets.ssdMobilenetv1.params) {
    // 依赖
    await faceapi.nets.ssdMobilenetv1.load('/models')
    await faceapi.loadFaceLandmarkModel('/models')
  }
  emits('loadMod', true)
  // 加载完毕
  loading.value = false
}
// 摄像头画面配置
const constraints = {
  audio: false, //音频轨道
  video: { width: 500, height: 500 }  //视频轨道
}
// 开启摄像头
const openMedia = async () => {
  try {
    // 获取媒体流
    mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    if (mediaStream) {
      emits('media', { media: mediaStream, status: true })
      // 视频源
      video.value.srcObject = mediaStream;
      video.value.play();
      await initMod()
      // 播放时人脸识别
      video.value.addEventListener('timeupdate', handleFace)
    }

  } catch (err) {
    error.value = true
    emits('error', err)
    console.error(err);
  }
};
// 处理人脸
const handleFace = async () => {
  if (!!faceapi.nets.ssdMobilenetv1.params && video.value && canvas.value) {
    // 配置
    const options = new faceapi.SsdMobilenetv1Options({ minConfidence })
    // 匹配结果
    const results = await faceapi.detectSingleFace(video.value, options)
    // 显示
    const dims = faceapi.matchDimensions(canvas.value, video.value, true)
    if (results) {
      // 匹配
      match.value = true
      // 检测
      const detections = faceapi.resizeResults([results], dims)
      const { x, y, width, height } = detections[0].box
      // 绘制矩形框
      const ctx = canvas.value.getContext("2d");
      ctx.beginPath();
      ctx.lineWidth = "4";
      ctx.strokeStyle = "#7dff7d";
      ctx.rect(x, y, width, height);
      ctx.stroke();
      // 触发
      const { file, dataURL } = createFile(detections[0].box)
      // 多次延时触发
      if (file) {
        handleFile({ status: true, file, dataURL })
      }
      // 单次触发
      if (!matchOnce.value) {
        emits('find', { status: true, file, dataURL })
        matchOnce.value = true
      }

      // 绘制
      // faceapi.draw.drawDetections(canvas.value, detections)
    } else {
      // 匹配
      match.value = false
      // 触发
      handleFile({ status: false, file: null, dataURL: '' })

    }
  }
}
// 生成文件
const createFile = (box) => {
  if (canvas.value && video.value) {
    // 视频宽高
    const videoH = constraints.video.height
    const videoW = constraints.video.width
    // 人脸位置
    const { x, y, width, height } = box
    //获取 `canvas`元素，根据`video`中的数据进行图片绘制 `ctx.drawImage()`；
    const ctx = imgCanvas.value.getContext('2d');
    const max = Math.max(width, height)
    const newX = x + max >= videoW ? videoW - max : x <= 0 ? 0 : x
    const newY = y + max >= videoH ? videoH - max : y <= 0 ? 0 : y
    ctx.drawImage(video.value, newX, newY, max, max, 0, 0, 320, 320);
    //将 `canvas`转换为链接
    const dataURL = imgCanvas.value.toDataURL(mimetype.value);
    document.querySelector('#img').src = dataURL
    // 文件
    const file = dataURLtoFile(dataURL, mimetype.value)
    return {
      file,
      dataURL
    }
  }
  return {
    file: null,
    dataURL: ''
  }
};
// dataURLtoFile
const dataURLtoFile = (dataURI, type) => {
  const binary = atob(dataURI.split(',')[1]);
  let array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: type });
}
// 关闭摄像头
const closeMedia = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => {
      track.stop();
    });
  }
  // 关闭
  emits('media', { media: null, status: false })
}
// 节流
const throttle = (fn, delay) => {
  let timer = -1
  return function () {
    const ctx = this
    const args = arguments
    if (timer === -1) {
      timer = setTimeout(() => {
        fn.apply(ctx, args)
        timer = -1
      }, delay)
    }

  }
}
// 处理文件
const handleFile = throttle((data) => {
  emits('match', data)
}, delay.value)
</script>

<style scoped>
.bg-black {
  --bg-opacity: 1;
  background-color: rgb(0 0 0 / var(--bg-opacity));
}
.bg-opacity-75 {
  --bg-opacity: 0.75;
}
.text-white {
  color: #fff;
}
.text-green {
  color: #7dff7d;
}
.text-base {
  font-size: 16px;
}
.text-20 {
  font-size: 40px;
}
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.top-0 {
  top: 0;
}
.left-0 {
  left: 0;
}
.right-0 {
  right: 0;
}
.bottom-0 {
  bottom: 0;
}
.w-320 {
  width: 320px;
}
.h-320 {
  height: 320px;
}
.w-30 {
  width: 30px;
}
.h-30 {
  height: 30px;
}
.pt-10 {
  padding-top: 10px;
}
.pl-10 {
  padding-left: 10px;
}
.p-10 {
  padding: 10px;
}
.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-col {
  flex-direction: column;
}
.grid-center {
  display: grid;
  place-items: center;
}
.loading {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
.opacity-75 {
  opacity: 0.75;
}
.opacity-25 {
  opacity: 0.25;
}
.object-cover {
  object-fit: cover;
}
@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>