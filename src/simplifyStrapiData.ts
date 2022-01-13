/* eslint-disable @typescript-eslint/no-use-before-define */
import { computed, Ref } from "vue"

export function simplifyStrapiDataa(data: any): any {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, simplifyValue(value)]))
}

function simplifyArray(array: any[]): any[] {
  return array.map(value => {
    if (typeof value === "object") return simplifyStrapiData(value)
    return value
  })
}

function simplifyValue(value: any) {
  if (typeof value === "object" && !Array.isArray(value) && value !== null) {
    console.log(value)
    const { data } = value

    if (Array.isArray(data)) {
      return simplifyArray(data)
    }

    return {
      id: data.id,
      ...simplifyStrapiData(data.attributes)
    }
  }

  return value
}

export function simplifyStrapiData(value: any): any {
  if (typeof value === "object") {
    if (Array.isArray(value)) return value.map(simplifyStrapiData)

    const typename = value.__typename ?? ""

    if (typename.endsWith("ResponseCollection")) return simplifyStrapiData(value.data)
    if (typename.endsWith("Response")) return simplifyStrapiData(value.data)

    if (typename.endsWith("Entity")) return {
      id: value.id,
      ...simplifyStrapiData(value.attributes)
    }

    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, simplifyStrapiData(v)]))
  }

  return value
}

export const useSimplifiedStrapiData = (data: Ref) => computed(() => simplifyStrapiData(data.value))
