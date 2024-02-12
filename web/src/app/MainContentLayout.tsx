"use client"

import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { usePathname } from "next/navigation";
import { ReactNode, useContext } from "react";
import ViewDisplayContext from "@/context/ViewDisplayContext";
import { tss } from "tss-react/mui";

const contactEmail = 'mailto:john.doe@dgfip.finances.gouv.fr'

interface MainContentLayoutProps {
    children: ReactNode
}

export default function MainContentLayout({children}: MainContentLayoutProps) {
    // Depending on the page, we'll display a different layout configuration
    const {isFullHeight} = useContext(ViewDisplayContext)
    const {classes} = useStyles({isFullHeight})

    // We'll need to know the current path to highlight the active navigation link
    const pathname = usePathname()

    // We define our navigation links
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
    }))

    return (
        <>
            <div className={classes.headerMain}>
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
                                    href: contactEmail
                                },
                                text: 'Nous contacter'
                            }
                        ]}
                        navigation={navigation}/>

                {/* Main Content */}
                <div className={classes.main}>
                    {children}
                </div>

            </div>

            {/* Layout Footer */}
            {
                !isFullHeight &&
				<Footer
					accessibility="fully compliant"
					contentDescription="
                    Un produit de la Direction de la Transformation Numérique
                    "
				/>
            }
        </>
    )
}

const useStyles = tss
    .withParams<{ isFullHeight: boolean }>()
    .create(({isFullHeight}) => ({
        headerMain: {
            ...(isFullHeight && {
                display: 'flex',
                flexDirection: 'column',
                height: '100vh'
            }),
        },
        main: {
            ...(isFullHeight && {
                flex: 1,
                overflow: 'hidden',
            }),
        },
    }))