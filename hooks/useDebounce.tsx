import { useEffect, useState } from "react"

// debounce 된 값을 return
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
    }, [value, delay]);

    return debouncedValue;
};
export default useDebounce;