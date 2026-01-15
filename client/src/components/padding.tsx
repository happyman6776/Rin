import React from "react";

export function Padding({ className = "", children }: { className?: string, children?: React.ReactNode }) {
    return (
        // 彻底删除 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 2xl:mx-32
        // 改用 w-full 确保容器占满宽度，只保留基础的左右内边距防止贴边
        <div className={`w-full px-4 md:px-6 lg:px-8 ${className} duration-300`} >
            {children}
        </div >
    )
}
