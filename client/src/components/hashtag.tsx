import { useLocation } from "wouter"

export function HashTag({ name }: { name: string }) {
    const [_, setLocation] = useLocation()
    return (
        <button onClick={(e) => { e.preventDefault(); setLocation(`/hashtag/${name}`) }}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-theme/10 text-theme hover:bg-theme/20 dark:bg-theme/20 dark:hover:bg-theme/30 transition-all duration-300 font-medium text-sm">
            <span>#</span>
            <span>{name}</span>
        </button>
    )
}