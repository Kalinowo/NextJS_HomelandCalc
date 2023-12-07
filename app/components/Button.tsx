interface ButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  flexBasis?: string;
}

const Button = (props: ButtonProps) => {
  const { type, children, onClick, disabled, flexBasis } = props;
  return (
    <button
      type={type}
      onClick={onClick}
      className="flex items-center justify-center text-red-50 rounded-md px-3 py-2 whitespace-nowrap"
      disabled={disabled}
      style={{ flexBasis: flexBasis }}
    >
      {children}
    </button>
  );
};

export default Button;
