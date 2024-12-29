import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Head from "next/head"
import styles from './Dashboard.module.css'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req })
    // console.log("🚀 ~ constgetServerSideProps:GetServerSideProps= ~ session:", session)
    if (!session?.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default function Dashboard() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>

            <h1>Pagina Painel</h1>
        </div>
    )
}