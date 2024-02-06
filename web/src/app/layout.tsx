"use client"

import { ReactNode } from "react"
import { DsfrHead } from "@codegouvfr/react-dsfr/next-appdir/DsfrHead"
import { DsfrProvider } from "@codegouvfr/react-dsfr/next-appdir/DsfrProvider"
import { getHtmlAttributes } from "@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes"
import { StartDsfr } from "./StartDsfr"
import { defaultColorScheme } from "./defaultColorScheme"
import Link from "next/link"
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";
import { usePathname } from "next/navigation"

export default function RootLayout({children}: { children: ReactNode }) {
    //NOTE: The lang parameter is optional and defaults to "fr"
    const lang = "fr"
    const pathname = usePathname()
    let navigation = [
        {
            isHome: true,
            linkProps: {
                href: '/',
            },
            text: 'Accueil'
        },
        {
            linkProps: {
                href: '/demo',
            },
            text: 'Démo'
        },
    ].map(n => ({
        ...n,
        isActive: n.isHome ? pathname === '/' : pathname.startsWith(n.linkProps.href)
    }));
    return (
        <html {...getHtmlAttributes({defaultColorScheme, lang})} >

        {/* HTML page Header */}
        <head>
            <StartDsfr/>
            <DsfrHead Link={Link}
                      preloadFonts={[
                          // We preload the loaded fonts to avoid a flash of unstyled text
                          //"Marianne-Light",
                          //"Marianne-Light_Italic",
                          "Marianne-Regular",
                          //"Marianne-Regular_Italic",
                          "Marianne-Medium",
                          //"Marianne-Medium_Italic",
                          "Marianne-Bold",
                          //"Marianne-Bold_Italic",
                          //"Spectral-Regular",
                          //"Spectral-ExtraBold"
                      ]}/>
            <title>Chatbot</title>
        </head>

        {/* HTML page Body */}
        <body>
        <DsfrProvider lang={lang}>

            {/* Layout Header */}
            <Header brandTop='DGFiP'
                    homeLinkProps={{
                        href: '/',
                        title: 'DATA | Transformation Numérique',
                    }}
                    id="fr-header-simple-header-with-service-title-and-tagline"
                    serviceTitle='Pôle DATA | Transformation Numérique'
                    serviceTagline='Projet IA Générative'
                    quickAccessItems={[
                        {
                            iconId: 'fr-icon-mail-fill',
                            linkProps: {
                                href: 'mailto:john.doe@dgfip.finances.gouv.fr'
                            },
                            text: 'Nous contacter'
                        }
                    ]}
                    navigation={navigation}/>
            <NextAppDirEmotionCacheProvider options={{key: "css"}}>

                {/* Layout Content */}
                {children}

            </NextAppDirEmotionCacheProvider>
            {/* Layout Footer */}
            <Footer
                accessibility="fully compliant"
                contentDescription="
                    Un produit de la Direction de la Transformation Numérique
                    "
                // termsLinkProps={{
                //     href: '#'
                // }}
                // websiteMapLinkProps={{
                //     href: '#'
                // }}
            />
        </DsfrProvider>
        </body>
        </html>
    )
}