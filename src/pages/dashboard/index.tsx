import { GetServerSideProps } from "next"
import Link from "next/link"
import { getSession } from "next-auth/react"
import Head from "next/head"
import styles from './Dashboard.module.css'
import Textarea from "@/components/Textarea"
import { FiShare2 } from "react-icons/fi"
import { FaTrash } from "react-icons/fa"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { db } from "@/services/firebaseConnection"
import { addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc } from "firebase/firestore"

type DashboardProps = {
    user: {
        email: string
    }
}

type Task = {
    id: string;
    created: Date;
    public: boolean;
    task: string;
    user: string;
}

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
        props: {
            user: {
                email: session?.user?.email
            }
        }
    }
}

export default function Dashboard({ user }: DashboardProps) {
    const [input, setInput] = useState("")
    const [publicTask, setPublicTask] = useState(false)
    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
        async function loadTasks() {
            const tasksRef = collection(db, "tasks")
            const queryTasks = query(
                tasksRef,
                orderBy("created", "desc"),
                where("user", "==", user?.email)
            )

            onSnapshot(queryTasks, (snapShot) => {
                let tasksList: Task[] = []
                snapShot.forEach(doc => {
                    tasksList.push({
                        id: doc.id,
                        task: doc.data().task,
                        created: doc.data().created,
                        user: doc.data().user,
                        public: doc.data().public
                    })
                })

                setTasks(tasksList)
            })
        }

        loadTasks()
    }, [user?.email])

    function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
        setPublicTask(event.target.checked);
    }

    async function handleRegisterTask(event: FormEvent) {
        event.preventDefault();

        if (input === "") return;

        try {
            await addDoc(collection(db, "tasks"), {
                task: input,
                created: new Date(),
                user: user?.email,
                public: publicTask
            })

            setInput("")
            setPublicTask(false)
        } catch (error) {
            console.log("🚀 ~ handleRegisterTask ~ error:", error)
        }
    }

    async function handleShare(id: string) {
        const urlToCopy = `${process.env.NEXT_PUBLIC_URL}/task/${id}`

        await navigator.clipboard.writeText(
            `${urlToCopy}`
        )

        alert(`URL ${urlToCopy} copiada com sucesso`)
    }

    async function handleDelete(id: string) {
        const docRef = doc(db, "tasks", id)
        await deleteDoc(docRef)
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>

            <main className={styles.main}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Qual sua tarefa?</h1>
                        <form onSubmit={handleRegisterTask}>
                            <Textarea
                                placeholder="Digite qual sua tarefa..."
                                value={input}
                                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
                                required
                            />
                            <div className={styles.checkboxArea}>
                                <input
                                    className={styles.checkbox}
                                    type="checkbox"
                                    checked={publicTask}
                                    onChange={handleChangePublic}
                                />
                                <label>Deixar tarefa publica?</label>
                            </div>

                            <button className={styles.button} type="submit">Registrar</button>
                        </form>
                    </div>
                </section>
                <section className={styles.taskContainer}>
                    <h1>Minhas tarefas</h1>
                    {
                        tasks.map(task => (
                            <article key={task.id} className={styles.task}>
                                {task.public && (
                                    <div className={styles.tagContainer}>
                                        <label className={styles.tag}>PUBLICO</label>
                                        <button className={styles.shareButton} onClick={() => handleShare(task.id)}>
                                            <FiShare2 size={22} color="#3183ff" />
                                        </button>
                                    </div>
                                )}

                                <div className={styles.taskContent}>
                                    {
                                        task.public ?
                                            (
                                                <Link href={`/task/${task.id}`}>
                                                    <p>{task.task}</p>
                                                </Link>
                                            )
                                            :
                                            (
                                                <p>{task.task}</p>
                                            )
                                    }
                                    <button className={styles.trashButton} onClick={() => handleDelete(task.id)}>
                                        <FaTrash size={24} color="#ea3140" />
                                    </button>
                                </div>
                            </article>
                        ))
                    }

                    {/* <article className={styles.task}>
                        <div className={styles.tagContainer}>
                            <label className={styles.tag}>PUBLICO</label>
                            <button className={styles.shareButton}>
                                <FiShare2 size={22} color="#3183ff" />
                            </button>
                        </div>

                        <div className={styles.taskContent}>
                            <p>Minha primeira tarefa de exemplo show demais!</p>
                            <button className={styles.trashButton}>
                                <FaTrash size={24} color="#ea3140" />
                            </button>
                        </div>
                    </article> */}
                </section>
            </main>
        </div>
    )
}