import type { FC, ReactNode } from 'react'
import type { MotionProps } from 'framer-motion'
import { motion } from 'framer-motion'

interface MotionDivProps extends MotionProps {
  children?: ReactNode
  className?: string
}

export const Fade: FC<MotionDivProps> = ({ children, ...props }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} {...props}>
    {children}
  </motion.div>
)
