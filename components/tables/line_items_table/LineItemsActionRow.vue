<template>
  <tr>
    <td :colspan="items.length > 1 ? 3 : 5" class="blank-slate pt-2" @click="items.push({})">
      <div class="p-2 flex items-center justify-center bg-white border border-dashed border-gray-400 cursor-pointer text-gray-500 hover:text-green-500 hover:border-green-500 text-sm">
        <base-icon name="fas fa-plus" />
        <span class="ml-2">
          {{ $t('labels.line_item') }}
        </span>
      </div>
    </td>
    <td v-if="items.length > 1" :colspan="2" class="blank-slate pt-2" @click="items.pop()">
      <div class="p-2 flex items-center justify-center bg-white border border-dashed border-gray-400 cursor-pointer text-gray-500 hover:text-red-500 hover:border-red-500 text-sm">
        <base-icon name="fas fa-minus" />
        <span class="ml-2">
          {{ $t('labels.line_item') }}
        </span>
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'LineItemsActionRow',

  props: {
    items: { type: Array, required: true }
  }
}
</script>
