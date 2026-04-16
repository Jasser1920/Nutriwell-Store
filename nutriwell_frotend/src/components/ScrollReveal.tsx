import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

const ScrollReveal = ({ children, className = "", delay = 0, style }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

export default ScrollReveal;
