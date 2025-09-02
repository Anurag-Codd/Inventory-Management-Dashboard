import style from "./Button.module.css"

const Button = ({ type = "button", onClick, children, className = "", disabled }) => {
  return (
    <button
      type={type}        
      onClick={onClick}    
      disabled={disabled} 
      className={`${style.btn} ${className}`}
      aria-disabled={disabled ? "true" : "false"}
    >
      {children}
    </button>
  )
}

export default Button

