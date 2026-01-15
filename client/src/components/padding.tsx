import React from "react";

export function Padding({ className = "", children }: { className?: string, children?: React.ReactNode }) {
    // 删除了原有的 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 2xl:mx-32
    // 改用 w-full 和固定/响应式内边距 (pl-4 md:pl-10)，确保内容靠左
    return (
        <div className={`w-full pl-4 md:pl-10 pr-4 md:pr-10 ${className} duration-300`} >
            {children}
        </div >
    )
}
