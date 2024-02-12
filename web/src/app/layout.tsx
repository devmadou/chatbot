"use client"

import { ReactNode, } from "react"
import { DsfrHead } from "@codegouvfr/react-dsfr/next-appdir/DsfrHead"
import { DsfrProvider } from "@codegouvfr/react-dsfr/next-appdir/DsfrProvider"
import { getHtmlAttributes } from "@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes"
import { StartDsfr } from "./StartDsfr"
import { defaultColorScheme } from "./defaultColorScheme"
import Link from "next/link"
import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";
import { ViewDisplayProvider } from "@/context/ViewDisplayContext";
import MainContentLayout from "@/app/MainContentLayout";

export default function RootLayout({children}: { children: ReactNode }) {
    //NOTE: The lang parameter is optional and defaults to "fr"
    const lang = "fr"

    return (
        <html {...getHtmlAttributes({defaultColorScheme, lang})} >

        {/* HTML page Header */}
        <head>
            <StartDsfr/>
            <DsfrHead Link={Link}
                      preloadFonts={[
                          // We preload the loaded fonts to avoid a flash of unstyled text
                          "Marianne-Regular",
                          "Marianne-Medium",
                          "Marianne-Bold",
                      ]}/>
            <title>Chatbot</title>
        </head>

        {/* HTML page Body */}
        <body>
        <DsfrProvider lang={lang}>
            <ViewDisplayProvider>
                <NextAppDirEmotionCacheProvider options={{key: "css"}}>
                    <MainContentLayout>
                        {children}
                    </MainContentLayout>
                </NextAppDirEmotionCacheProvider>
            </ViewDisplayProvider>
        </DsfrProvider>
        </body>
        </html>
    )
}