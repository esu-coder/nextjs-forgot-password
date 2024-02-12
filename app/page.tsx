import LoginForm from './components/Auth/Login'
import styles from './page.module.scss'

export default function Home() {
  return (
    <main className={styles.main}>
      <LoginForm />
    </main>
  )
}
