import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const menuItems = [
    { name: "营养与饮食", path: "/category/nutrition" },
    { name: "慢病管理", subtitle: "三高/糖尿病等", path: "/category/chronic-disease" },
    { name: "运动与康复", path: "/category/exercise" },
    { name: "心理与睡眠", path: "/category/mental-health" },
    { name: "常见病防治", path: "/category/common-diseases" },
    { name: "健康生活", subtitle: "体检/疫苗/体重等", path: "/category/healthy-living" },
    { name: "妇幼健康", path: "/category/maternal-child" },
    { name: "中医养生", disclaimer: "免责声明：内容仅供参考，就诊请遵医嘱", path: "/category/tcm" },
    { name: "名医介绍", path: "/category/doctors" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-6">
        <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
          健康专栏
        </h2>
        <nav className="flex flex-col gap-5">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className="group block no-underline"
            >
              <div className="text-[16px] font-medium t-primary group-hover:text-blue-500 transition-colors">
                {item.name}
              </div>
              {item.subtitle && (
                <div className="text-xs text-neutral-500 mt-0.5 font-normal">
                  {item.subtitle}
                </div>
              )}
              {item.disclaimer && (
                <div className="text-[10px] text-red-400/80 mt-1 italic leading-tight border-l-2 border-red-100 pl-2">
                  {item.disclaimer}
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
