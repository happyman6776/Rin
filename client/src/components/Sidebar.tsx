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
      {/* 标题优化：加大字号并微调边距 */}
      <div className="mb-6 pl-1">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
          <span className="w-2 h-7 bg-blue-600 rounded-full inline-block shadow-sm"></span>
          健康专栏
        </h2>
      </div>

      {/* 列表间距：gap-2 保持紧凑但不局促 */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              // py-3 提供更好的点击感和视觉高度
              className={`group relative flex flex-col px-6 py-3 rounded-2xl transition-all duration-300 no-underline border border-transparent
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 translate-x-1.5' 
                  : 'bg-white/50 text-blue-900/80 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100/60 hover:shadow-md hover:translate-x-1.5' 
                }`}
            >
              <div className="flex items-center justify-between">
                {/* 栏目文字加大到 17px，并加粗 */}
                <span className="text-[17px] font-bold tracking-normal">
                  {item.name}
                </span>
                <svg className={`w-4 h-4 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {item.subtitle && (
                <span className={`text-[12px] mt-1 font-medium opacity-90 ${isActive ? 'text-blue-50' : 'text-blue-400 group-hover:text-blue-500'}`}>
                  {item.subtitle}
                </span>
              )}
              
              {item.disclaimer && (
                <span className={`text-[11px] mt-2 pt-2 border-t border-dashed leading-snug ${isActive ? 'border-blue-400 text-blue-100' : 'border-slate-200 text-red-500/80'}`}>
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
