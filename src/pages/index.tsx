import Head from "next/head";
import styles from '@/styles/pages/Home.module.css'
import Image from "next/image"
import heroImg from '../../public/images/hero.png'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas+ | Organize suas tarefas de forma fácil</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            alt="Logo tarefas"
            src={heroImg}
            priority
          />
          <h1 className={styles.title}>
            Sistema feito para você organizar <br />
            seus estudos e terefas
          </h1>
        </div>
      </main>
    </div>
  )
}