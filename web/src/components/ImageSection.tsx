import { ReactNode } from "react";
import { tss } from "tss-react/mui";
import { fr } from "@codegouvfr/react-dsfr";

interface SectionProps {
    children: ReactNode
    imgSrc: string
    imgAlt: string
    flip?: boolean
}

export default function ImageSection({children, imgSrc, imgAlt, flip = false}: SectionProps) {
    const {classes} = useStyles({flip})
    const sectionText = (
        <div className={classes.sectionText}>
            {children}
        </div>
    )

    const sectionImageContainer = (
        <div className={classes.sectionImageContainer}>
            <img src={imgSrc} alt={imgAlt}/>
        </div>
    )

    const sectionContent = flip ?
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
    .withParams<{ flip: boolean }>()
    .create(({theme, flip}) => ({
        sectionContent: {
            display: 'flex',
            columnGap: fr.spacing("4w"),
            flexDirection: flip ? 'column-reverse' : 'column',
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