function RouteMe({ path, children, headerComponent, paddingClassName, requirePermission }:
  { path?: PathPattern, children: React.ReactNode | ((params: DefaultParams) => React.ReactNode), headerComponent?: React.ReactNode, paddingClassName?: string, requirePermission?: boolean }) {
  
  if (requirePermission) {
    const profile = useContext(ProfileContext);
    const { t } = useTranslation();
    if (!profile?.permission)
      children = <ErrorPage error={t('error.permission_denied')} />;
  }

  return (
    <Route path={path} >
      {params => {
        return (<>
          <Header>
            {headerComponent}
          </Header>
          <Padding className={paddingClassName}>
            {/* 1. 将最大宽度提高到 7xl (1280px) 或全屏，增加内容空间 */}
            <div className="flex flex-col lg:flex-row gap-8 xl:gap-16 max-w-[1440px] mx-auto py-8">
              
              {/* 2. 固定侧边栏宽度，防止其随着容器增大而变宽 */}
              <aside className="w-full lg:w-[240px] flex-shrink-0">
                <Sidebar />
              </aside>
              
              {/* 3. 主内容区：使用 flex-1 占据剩余所有空间 */}
              <main className="flex-1 min-w-0 bg-white/40 backdrop-blur-md rounded-[2rem] shadow-sm border border-neutral-100/50 p-4 md:p-8">
                <div className="max-w-4xl mx-auto"> 
                  {/* 这里再次限制文章阅读宽度的最大值，保证阅读舒适度 */}
                  {typeof children === 'function' ? children(params) : children}
                </div>
              </main>
            </div>
          </Padding>
          <Footer />
        </>)
      }}
    </Route>
  )
}
