import React from "react";

export function Padding({ className = "", children }: { className?: string, children?: React.ReactNode }) {
    return (
        // 1. 移除 mx-32 等硬编码边距，改为全宽 w-full
        // 2. 使用响应式内边距 px-4 到 px-10，确保内容在贴左的同时不撞边
        <div className={`w-full px-4 md:px-8 xl:px-10 ${className} transition-all duration-500 ease-in-out`} >
            {children}
        </div >
    )
}
