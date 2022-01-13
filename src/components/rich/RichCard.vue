<template>
  <div class="flex my-5">
    <div class="border-1 max-w-100 min-w-80 -sm:w-full shadow-md border-gray-200 rounded-md flex flex-col py-5 px-6">
      <div class="uppercase tracking-wide text-s1 text-orange-700">
        {{ type }}
      </div>
      <div class="font-bold text-5 truncate">
        {{ title }}
      </div>
      <div>
        <slot/>
      </div>
      <div class="text-yellow-600 text-4 pt-3">
        <!--suppress HtmlUnknownAttribute -->
        <slot name="action" classes="flex items-center space-x-2"/>
      </div>
    </div>
  </div>
</template>

<style module>

</style>

<script>
  export default {
    name: "RichCard",
    props: {
      type: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      }
    }
  }
</script>
