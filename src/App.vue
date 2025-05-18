<template>
  <div>
    <button @click="showAlert('드론 추락에 주의하세요.')">알림 띄우기</button>

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
      repeatLimit: 3,
      repeatSecond: 2000,
    };
  },
  methods: {
    showAlert(messageKey) {
      this.alertMessage = messageKey;
      this.readAlert(messageKey);
    },

    /**
     * Web Speech API를 사용하여 전달된 텍스트를 읽어준다.
     */
    readAlert(text) {
      // 브라우저가 speechSynthesis를 지원하지 않으면 리턴
      if (!window.speechSynthesis) return;

      this.repeatSpeak(text, this.repeatLimit, this.repeatSecond);
    },

    /**
     * 특정 텍스트를 지정한 횟수만큼, 간격 두고 반복해서 읽기
     * @param {string} text 읽을 텍스트
     * @param {number} repeatLimit 반복 횟수
     * @param {number} delay 반복 간격(ms)
     */
    repeatSpeak(text, repeatLimit = 3, delay = 2000) {
      // 혹시 이전에 대기 중이거나 말하고 있는 음성이 있다면 취소하고 초기화
      window.speechSynthesis.cancel();

      let repeatCount = 0;
      // const langCode = this.getLangCode(this.$i18n.locale);
      const langCode = this.getLangCode("ko");
      const matchedVoice = this.getMatchedVoice(langCode);

      const speakOnce = () => {
        // 읽어줄 텍스트를 담은 음성 객체 생성
        const utterance = new SpeechSynthesisUtterance(text);

        // 현재 언어(locale)에 따라 음성 언어 코드 설정 (예: ko-KR, en-US 등)
        utterance.lang = langCode;
        if (matchedVoice) {
          // 언어에 일치하는 음성이 있다면 담아준다.
          utterance.voice = matchedVoice;
        }

        // 텍스트를 읽어준다.
        window.speechSynthesis.speak(utterance);
        // 반복 횟수 증가시킴
        repeatCount++;

        if (repeatCount < repeatLimit) {
          // 반복 횟수 최대치에 도달하기 전에 한번더 실행
          setTimeout(speakOnce, delay);
        }
      };

      speakOnce(); // 첫 실행
    },
    /**
     * Web Speech API에서 언어 코드에 맞는 voice 객체 반환
     */
    getMatchedVoice(langCode) {
      const voices = window.speechSynthesis.getVoices();
      return voices.find((voice) => voice.lang.startsWith(langCode));
    },
    /**
     * i18n 언어 번역 기능을 사용하고 있기 때문에 필요한 함수
     * @param {string} locale
     */
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
