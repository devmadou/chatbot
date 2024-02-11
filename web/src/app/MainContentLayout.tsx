"use client"

import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { usePathname } from "next/navigation";
import { ReactNode, useContext } from "react";
import ViewDisplayContext from "@/context/ViewDisplayContext";
import { tss } from "tss-react/mui";

interface MainContentLayoutProps {
    children: ReactNode
}

export default function MainContentLayout({children}: MainContentLayoutProps) {
    const {isFullHeight} = useContext(ViewDisplayContext)
    const {classes} = useStyles({isFullHeight})
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
                                    href: 'mailto:john.doe@dgfip.finances.gouv.fr'
                                },
                                text: 'Nous contacter'
                            }
                        ]}
                        navigation={navigation}/>

                <div className={classes.main}>

                    {/* Layout Content */}
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
                    // termsLinkProps={{
                    //     href: '#'
                    // }}
                    // websiteMapLinkProps={{
                    //     href: '#'
                    // }}
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
            }),
        },
    }))