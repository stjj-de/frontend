<template>
  <div class="flex-shrink-0 flex flex-col items-center px-8 py-6 border-2 border-gray-300 rounded-lg border-dashed relative">
    <UploadedImageWithShadow
      class="rounded-full w-50 h-50 object-cover mb-8"
      :url="person.image.url"
      :alt="person.displayName"
    />
    <div class="text-6 font-bold text-gray-900">
      {{ person.displayName }}
    </div>
    <div class="text-5">
      {{ person.role }}
    </div>
    <div class="flex flex-col space-y-2 pt-5">
      <div class="flex items-center space-x-2">
        <PhoneIcon class="text-4"/>
        <a class="link" :href="`tel:${person.telephoneNumber.replaceAll(' ', '')}`">
          {{ person.telephoneNumber }}
        </a>
      </div>
      <div class="flex items-center space-x-2">
        <EmailIcon class="text-4"/>
        <a class="link" :href="`mailto:${person.emailAddress}`">
          {{ person.emailAddress }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

<script>
  import UploadedImage from "./UploadedImage.vue"
  import PhoneIcon from "~icons/ph/phone"
  import EmailIcon from "~icons/ic/outline-email"
  import UploadedImageWithShadow from "./UploadedImageWithShadow.vue"

  export default {
    name: "PersonCard",
    components: { UploadedImageWithShadow, UploadedImage, PhoneIcon, EmailIcon },
    props: {
      person: {
        type: Object,
        required: true
      }
    }
  }
</script>
