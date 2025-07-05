export default function Checkbox({ className = "", ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                "rounded border-gray-300 text-accent shadow-sm focus:ring-accent " +
                className
            }
        />
    );
}
