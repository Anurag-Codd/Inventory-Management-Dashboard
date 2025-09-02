import style from "./Input.module.css";

const Input = ({
  inputStyle,
  id,
  label,
  value,
  disabled,
  onChange,
  required,
  type = "text",
  placeholder,
  children
}) => {
  return (
    <div className={style.formGroup}>
      <label className={style.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        onChange={onChange}
        className={`${style.input} ${inputStyle}`}
      />{children}
    </div>
  );
};

export default Input;
