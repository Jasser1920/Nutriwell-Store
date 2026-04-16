interface WaveDividerProps {
  fillColor?: string;
  className?: string;
  flip?: boolean;
}

const WaveDivider = ({ fillColor = "hsl(0 0% 100%)", className = "", flip = false }: WaveDividerProps) => {
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""} ${className}`}>
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
