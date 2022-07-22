import Layout from "../components/Layout"
import Image from "next/image"
import styles from "../styles/inicio.module.css"

export default function Home() {
  return (
    <Layout
      page='Inicio'
    >
      <div className={styles.inicio}>
        <div className=" flex justify-center">
          <Image
            className=" "
            src="/img/logo.png"
            width={400}
            height={400}
          />
        </div>
        <h1 className=" font-bold text-center text-6xl text-white font-mono ">Civil enginneers and technology</h1>
        <p className=" text-3xl text-center text-white font-mono">Ingenieros civiles y tecnologias</p>
      </div>
    </Layout>   

  )
}
