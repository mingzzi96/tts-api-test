<template>
  <div>
    <button @click="showAlert('드론 추락에 주의하십시오.')">알림 띄우기</button>

    <div v-if="alertMessage" class="alert">
      {{ alertMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      alertMessage: "",
    };
  },
  methods: {
    showAlert(messageKey) {
      this.alertMessage = messageKey;
    },

    /**
     * Web Speech API를 사용하여 전달된 텍스트를 읽어준다.
     */
    readAlert(text) {
      // 브라우저가 speechSynthesis를 지원하지 않으면 리턴
      if (!window.speechSynthesis) return;

      // 읽어줄 텍스트를 담은 음성 객체 생성
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getLangCode(this.$i18n.locale);

      // 선택적으로 적절한 음성 설정
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find((voice) =>
        voice.lang.startsWith(utterance.lang)
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      window.speechSynthesis.cancel(); // 기존 대기 음성 제거
      window.speechSynthesis.speak(utterance);
    },
    getLangCode(locale) {
      switch (locale) {
        case "ko":
          return "ko-KR";
        case "en":
          return "en-US";
        case "ja":
          return "ja-JP";
        case "zh":
        case "zh-CN":
          return "zh-CN";
        default:
          return "en-US";
      }
    },
  },
  mounted() {
    // 일부 브라우저에서는 `getVoices()`가 지연되므로 preload 필요
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  },
};
</script>

<style></style>
