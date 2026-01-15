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
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-28 space-y-6 pr-4">
        {/* 侧边栏标题设计 */}
        <div className="px-4">
          <h2 className="text-[11px] font-black text-blue-600/60 uppercase tracking-[0.25em]">
            健康专栏
          </h2>
          <div className="h-1 w-6 bg-blue-500/30 mt-1.5 rounded-full"></div>
        </div>

        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`group block px-4 py-3.5 rounded-2xl transition-all duration-300 no-underline
                  ${isActive 
                    ? 'bg-blue-50/80 shadow-sm text-blue-700' 
                    : 'hover:bg-neutral-50 text-neutral-600 hover:translate-x-1'}`}
              >
                <div className={`text-[15px] font-bold ${isActive ? 'scale-105' : ''} transition-transform origin-left`}>
                  {item.name}
                </div>
                {item.subtitle && (
                  <div className={`text-[11px] mt-0.5 font-normal opacity-70`}>
                    {item.subtitle}
                  </div>
                )}
                {item.disclaimer && (
                  <div className="text-[9px] text-red-400 mt-2 pt-2 border-t border-red-100/40 italic leading-tight font-normal">
                    {item.disclaimer}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
