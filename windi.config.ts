import { defineConfig } from "windicss/helpers"
import colors from "windicss/colors"
import aspectRatioPlugin from "windicss/plugin/aspect-ratio"
import lineClampPlugin from "windicss/plugin/line-clamp"
import plugin from "windicss/plugin"

const generateValues = (max: number, fn: (step: number) => any) => {
  const object: Record<number, any> = {}

  for (let i = 1; i <= max; i++) {
    object[i] = fn(i)
  }

  return object
}

export default defineConfig({
  theme: {
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.stone,
      red: colors.red,
      yellow: colors.amber,
      orange: colors.orange,
      green: colors.green,
      blue: colors.blue,
      violet: colors.fuchsia,
      transparent: colors.transparent
    },
    fontFamily: {
      serif: ["Playfair Display", "serif"],
      sans: ["Rubik", "sans-serif"]
    },
    fontWeight: {
      normal: 400,
      bold: 700
    },
    fontSize: {
      ...generateValues(30, step => `${step * 0.25}rem`),
      4: "1.2rem",
      3: "1.1rem",
      2: "1rem",
      s1: "0.9rem",
      s2: "0.8rem",
      s3: "0.7rem"
    },
    extend: {
      animation: {
        pulse: "pulse 800ms cubic-bezier(0.4, 0, 0.6, 1) infinite"
      }
    }
  },
  shortcuts: {
    "yellow-underlined": {
      "box-shadow": "inset 0 -0.5em 0 0 #FFDD90"
    }
  },
  plugins: [
    aspectRatioPlugin,
    lineClampPlugin,
    plugin(({ addVariant }) => {
      addVariant("can-hover", ({ atRule }) => atRule("@media(hover: hover)"))
      addVariant("cannot-hover", ({ atRule }) => atRule("@media(hover: none)"))
    })
  ]
})
