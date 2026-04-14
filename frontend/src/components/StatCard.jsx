import CountUp from 'react-countup'
import { motion } from 'framer-motion'

export default function StatCard({ title, value, color }) {
  return (
    <motion.div
      className="card"
      initial={{ opacity:0, y:30 }}
      animate={{ opacity:1, y:0 }}
      whileHover={{ scale:1.03 }}
    >
      <p style={{opacity:.7}}>{title}</p>
      <h1 style={{fontSize:'36px', color}}>
        <CountUp end={value} duration={2}/>
      </h1>
    </motion.div>
  )
}