import Head from "next/head"
import styles from './Dashboard.module.css'

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