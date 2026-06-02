<script setup lang="ts">
interface PropRow {
  name: string
  type: string
  default?: string
  description: string
  required?: boolean
}

defineProps<{ rows: PropRow[] }>()
</script>

<template>
  <div class="uk-props">
    <table class="uk-props__table">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Тип</th>
          <th>По умолчанию</th>
          <th>Описание</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.name">
          <td>
            <code class="uk-props__name">{{ row.name }}</code>
            <span v-if="row.required" class="uk-props__required">*</span>
          </td>
          <td>
            <code class="uk-props__type">{{ row.type }}</code>
          </td>
          <td>
            <code v-if="row.default" class="uk-props__default">{{ row.default }}</code
            ><span v-else class="uk-props__none">—</span>
          </td>
          <td class="uk-props__desc">{{ row.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss">
@use "~/assets/styles/variables" as *;
@use "~/assets/styles/mixins" as mixins;
.uk-props {
  overflow-x: auto;
  border-radius: $radius-lg;
  border: 1px solid $color-gray-200;

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: $font-size-sm;

    th {
      text-align: left;
      padding: 10px 14px;
      font-size: $font-size-xs;
      font-weight: $font-weight-semibold;
      color: $color-gray-500;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      background: $color-gray-50;
      border-bottom: 1px solid $color-gray-200;
    }

    td {
      padding: 10px 14px;
      border-bottom: 1px solid $color-gray-100;
      color: $color-gray-700;
      vertical-align: middle;

      &:last-child {
        border-bottom: none;
      }
    }

    tr:last-child td {
      border-bottom: none;
    }
  }

  &__name {
    color: $color-primary;
    font-family: monospace;
  }
  &__type {
    color: #0891b2;
    font-family: monospace;
    background: rgb(6 182 212 / 8%);
    padding: 1px 5px;
    border-radius: 4px;
  }
  &__default {
    color: $color-gray-600;
    font-family: monospace;
    background: $color-gray-100;
    padding: 1px 5px;
    border-radius: 4px;
  }
  &__none {
    color: $color-gray-300;
  }
  &__required {
    color: $color-danger;
    margin-left: 2px;
    font-weight: bold;
  }
  &__desc {
    color: $color-gray-600;
  }
}
</style>
