<template>
  <RichCard type="Datei" :title="data.label">
    <template #action="{ classes }">
      <a :href="data.file.url" :class="classes">
        <template v-if="data.file.mime === 'application/pdf'">
          <div>
            Öffnen
          </div>
          <ExternalIcon/>
        </template>
        <template v-else>
          <div>
            Herunterladen
          </div>
          <DownloadIcon/>
        </template>
      </a>
    </template>
  </RichCard>
</template>

<style module>

</style>

<script>
  import RichCard from "./RichCard.vue"
  import DownloadIcon from "~icons/ph/download-simple"
  import ExternalIcon from "~icons/lucide/external-link"

  export default {
    name: "RichItemFile",
    components: { RichCard, DownloadIcon, ExternalIcon },
    props: {
      data: {
        type: Object,
        required: true
      }
    }
  }
</script>
