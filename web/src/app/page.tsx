"use client"

import { tss } from "tss-react/mui";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import ImageSection from "@/components/ImageSection";

export default function Home() {
    const {classes} = useStyles()

    return (
        <main>
            <div className={classes.heroContainer}>
                <ImageSection imgSrc='/images/hero.jpg' imgAlt="Image de présentation">
                    <h1>Exploitez<br/>les facultés de l'IA</h1>
                    <p>
                        Avec l'avènement de l'IA, nous entrons dans une nouvelle ère.<br/>
                        Notre chatbot intelligent est prêt à répondre à vos questions avec rapidité et
                        précision. Essayez-le dès maintenant !
                    </p>
                    <Button linkProps={{
                        href: '/demo',
                    }}>
                        Accéder à la Démo
                    </Button>
                </ImageSection>
            </div>

            <ImageSection imgSrc='/images/app4.jpg' imgAlt="Image de l'application" flip>
                <h2>Les Technologies Utilisées</h2>
                <ul className='fr-mb-3w'>
                    <li>
                        Frontend en React basé sur <a href="https://github.com/codegouvfr/react-dsfr">react-dsfr</a>
                    </li>
                    <li>Backend en Python basé sur <a href="https://www.djangoproject.com/">Django</a></li>
                    <li>Plusieurs <a href="https://openai.com/">modèles</a> disponibles</li>
                </ul>
                <Button priority="secondary"
                        linkProps={{
                            href: '/demo',
                        }}>
                    Tester la solution
                </Button>
            </ImageSection>
        </main>
    )
}

const useStyles = tss
    .create(() => ({
        heroContainer: {
            backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
        },
    }))