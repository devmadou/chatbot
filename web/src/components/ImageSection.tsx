import { ReactNode } from "react";
import { tss } from "tss-react/mui";
import { fr } from "@codegouvfr/react-dsfr";

interface SectionProps {
    children: ReactNode
    imgSrc: string
    imgAlt: string
    flipOnResponsive?: boolean
}

export default function ImageSection({children, imgSrc, imgAlt, flipOnResponsive = false}: SectionProps) {
    const {classes} = useStyles({flipOnResponsive})

    // We'll separate our text content and image content into 2 variables, so we can flip them on responsive screens

    // Text content
    const sectionText = (
        <div className={classes.sectionText}>
            {children}
        </div>
    )

    // Image content
    const sectionImageContainer = (
        <div className={classes.sectionImageContainer}>
            <img src={imgSrc} alt={imgAlt}/>
        </div>
    )

    // If 'flipOnResponsive' is true, we'll flip the content of the section
    const sectionContent = flipOnResponsive ?
        <>{sectionImageContainer}{sectionText}</> :
        <>{sectionText}{sectionImageContainer}</>

    return (
        <section className='fr-container fr-py-8w'>
            <div className={classes.sectionContent}>
                {sectionContent}
            </div>
        </section>
    )
}

const useStyles = tss
    .withParams<{ flipOnResponsive: boolean }>()
    .create(({theme, flipOnResponsive}) => ({
        sectionContent: {
            display: 'flex',
            columnGap: fr.spacing("4w"),
            flexDirection: flipOnResponsive ? 'column-reverse' : 'column',
            [theme.breakpoints.up("md")]: {
                flexDirection: 'row',
                alignItems: 'center',
            }
        },
        sectionText: {
            minWidth: "unset",
            [theme.breakpoints.up("md")]: {
                minWidth: 400,
            },
            [theme.breakpoints.up("lg")]: {
                minWidth: 500,
            },
        },
        sectionImageContainer: {
            img: {
                maxWidth: '100%',
                borderRadius: 16
            },
            marginTop: fr.spacing("4w"),
            [theme.breakpoints.up("md")]: {
                marginTop: "unset"
            },
        }
    }))