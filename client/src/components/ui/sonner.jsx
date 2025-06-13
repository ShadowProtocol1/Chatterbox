import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        style: {
          background: 'hsl(var(--popover))',
          color: 'hsl(var(--popover-foreground))',
          border: '1px solid hsl(var(--border))',
        },
      }}
      {...props} />
  );
}

export { Toaster }
