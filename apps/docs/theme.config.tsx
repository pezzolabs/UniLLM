import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import Image from "next/image"
import Logo from "./assets/logo.svg"

const config: DocsThemeConfig = {
  logo: <Image alt="UniLLM Logo" src={Logo} width={120} />,
  project: {
    link: 'https://github.com/pezzolabs/unillm',
  },
  chat: {
    link: 'https://pezzo.cc/discord',
  },
  docsRepositoryBase: 'https://github.com/pezzolabs/unillm/tree/main/apps/docs',
  footer: {
    text: 'UniLLM',
  },
  darkMode: true,
  themeSwitch: {
    component: false,
  },
  primaryHue: 320,
  primarySaturation: 70,
  useNextSeoProps() {
    return {
      titleTemplate: `%s - UniLLM`,
    }
  },
  head: (
    <>
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
      <link rel="manifest" href="/favicon/site.webmanifest"/>
    </>
  )
}

export default config
