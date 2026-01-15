import React from 'react';
import { Link, useLocation } from 'wouter';

const Sidebar: React.FC = () => {
  const [location] = useLocation();

  const menuItems = [
    { name: "营养与饮食", path: "/nutrition" },
    { name: "慢病管理", subtitle: "三高/糖尿病等", path: "/chronic-disease" },
    { name: "运动与康复", path: "/exercise" },
    { name: "心理与睡眠", path: "/mental-health" },
    { name: "常见病防治", path: "/common-diseases" },
    { name: "健康生活", subtitle: "体检/疫苗/体重等", path: "/healthy-living" },
    { name: "妇幼健康", path: "/maternal-child" },
    { name: "中医养生", disclaimer: "免责声明：内容仅供参考，就诊请遵医嘱", path: "/tcm" },
    { name: "名医介绍", path: "/doctors" },
  ];

  return (
    <aside className="w-full">
      {/* 1. 标题优化：加大字号(text-2xl)，加粗，并用蓝色竖线(border-l-4)进行视觉对齐 */}
      <div className="mb-6 pl-1">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block shadow-sm"></span>
          健康专栏
        </h2>
      </div>

      <nav className="flex flex-col gap-2.5">
        {menuItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              // 2. 交互优化：默认深蓝灰色，悬停变亮蓝+背景色
              className={`group relative flex flex-col px-5 py-4 rounded-2xl transition-all duration-300 no-underline border border-transparent
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-x-1' // 选中状态
                  : 'bg-white/50 text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100 hover:shadow-md hover:translate-x-1' // 默认状态
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-bold tracking-wide">
                  {item.name}
                </span>
                {/* 悬停时出现的箭头 */}
                <svg className={`w-4 h-4 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {item.subtitle && (
                <span className={`text-[12px] mt-1 font-medium ${isActive ? 'text-blue-100' : 'text-slate-400 group-hover:text-blue-400'}`}>
                  {item.subtitle}
                </span>
              )}
              
              {item.disclaimer && (
                <span className={`text-[10px] mt-2 pt-2 border-t border-dashed leading-tight ${isActive ? 'border-blue-400 text-blue-100' : 'border-slate-200 text-red-400'}`}>
                  {item.disclaimer}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;