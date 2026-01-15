import React from "react";

export function Padding({ className = "", children }: { className?: string, children?: React.ReactNode }) {
    return (
        // 彻底删除响应式 mx- 限制
        // 使用 pl-4 md:pl-10 确保侧边栏紧贴左侧，pr-4 md:pr-10 留出右侧呼吸感
        <div className={`w-full pl-4 md:pl-10 pr-4 md:pr-10 ${className} transition-all duration-300`} >
            {children}
        </div >
    )
}
