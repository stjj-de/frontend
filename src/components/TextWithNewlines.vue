<template>
  <div>
    <p
      v-for="(part, i) in text.split('\n')"
      :key="i"
    >
      {{ part }}
    </p>
  </div>
</template>

<script>
  export default {
    name: "TextWithNewlines",
    props: {
      text: {
        type: String,
        required: true
      }
    }
  }
</script>
