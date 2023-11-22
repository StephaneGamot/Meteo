import Image from 'next/image'
import styles from './page.module.css'
import AppliMeteo from '@/components/AppliMeteo'

export default function Home() {
  return (
    <main className={styles.main}>
    <AppliMeteo />
    </main>
  )
}
