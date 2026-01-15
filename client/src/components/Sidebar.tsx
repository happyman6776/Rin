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
    <aside className="w-full flex-shrink-0 hidden lg:block">
      <div className="sticky top-28 space-y-8">
        <div className="px-6">
          <h2 className="text-xs font-black text-theme/70 uppercase tracking-widest">
            健康专栏
          </h2>
          <div className="h-1 w-12 bg-theme/20 mt-2 rounded-full"></div>
        </div>

        <nav className="flex flex-col gap-2 px-4">
          {menuItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  group block px-6 py-4 rounded-2xl transition-all duration-300 no-underline
                  ${isActive
                    ? 'bg-theme/10 shadow-md shadow-theme/20 text-theme font-bold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/50 hover:translate-x-2 hover:shadow-sm'}
                `}
              >
                <div className={`
                  text-lg font-semibold transition-all duration-300
                  ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}
                `}>
                  {item.name}
                </div>
                {item.subtitle && (
                  <div className="text-sm mt-1 font-medium text-gray-500 dark:text-gray-400 opacity-80">
                    {item.subtitle}
                  </div>
                )}
                {item.disclaimer && (
                  <div className="text-xs text-red-500/80 dark:text-red-400/80 mt-3 pt-3 border-t border-red-200/30 dark:border-red-800/30 italic leading-relaxed">
                    {item.disclaimer}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 pt-6 border-t border-neutral-200/50 dark:border-neutral-700/50">
          <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed">
            本站内容仅供健康参考<br />
            如有不适，请及时就医
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;