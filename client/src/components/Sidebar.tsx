import React from 'react';
import { Link } from 'wouter'; // Rin 使用 wouter 进行路由跳转

const Sidebar: React.FC = () => {
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
      <div className="sticky top-24 space-y-8">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100 pb-2">
          健康专栏
        </h2>
        <nav className="flex flex-col gap-6">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className="group block no-underline"
            >
              <div className="text-[16px] font-medium t-primary group-hover:text-blue-600 transition-colors duration-200">
                {item.name}
              </div>
              {item.subtitle && (
                <div className="text-[12px] text-neutral-400 mt-1 font-normal">
                  {item.subtitle}
                </div>
              )}
              {item.disclaimer && (
                <div className="text-[10px] text-red-500/70 mt-2 italic leading-relaxed border-l-2 border-red-50 px-2">
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
