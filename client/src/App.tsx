import { useEffect, useRef, useState, useContext } from 'react'
import { Helmet } from 'react-helmet'
import { getCookie } from 'typescript-cookie'
import { DefaultParams, PathPattern, Route, Switch } from 'wouter'
import Footer from './components/footer'
import { Header } from './components/header'
import { Padding } from './components/padding'
import useTableOfContents from './hooks/useTableOfContents.tsx'
import { client } from './main'
import { CallbackPage } from './page/callback'
import { FeedPage, TOCHeader } from './page/feed'
import { FeedsPage } from './page/feeds'
import { FriendsPage } from './page/friends'
import { HashtagPage } from './page/hashtag.tsx'
import { HashtagsPage } from './page/hashtags.tsx'
import { Settings } from "./page/settings.tsx"
import { TimelinePage } from './page/timeline'
import { WritingPage } from './page/writing'
import { ClientConfigContext, ConfigWrapper, defaultClientConfig } from './state/config.tsx'
import { Profile, ProfileContext } from './state/profile'
import { headersWithAuth } from './utils/auth'
import { tryInt } from './utils/int'
import { SearchPage } from './page/search.tsx'
import { useTranslation } from 'react-i18next'
import { MomentsPage } from './page/moments'
import { ErrorPage } from './page/error.tsx'
import Sidebar from './components/Sidebar'

function App() {
  const ref = useRef(false)
  const { t } = useTranslation()
  const [profile, setProfile] = useState<Profile | undefined>()
  const [config, setConfig] = useState<ConfigWrapper>(new ConfigWrapper({}, new Map()))

  useEffect(() => {
    const HIGH_RES_THRESHOLD = 2560;
    const applyScaling = () => {
      if (window.screen.width >= HIGH_RES_THRESHOLD) {
        document.documentElement.style.fontSize = '125%';
      } else {
        document.documentElement.style.fontSize = '100%';
      }
    };
    applyScaling();
    
    if (ref.current) return
    if ((getCookie('token')?.length ?? 0) > 0) {
      client.user.profile.get({
        headers: headersWithAuth()
      }).then(({ data }) => {
        if (data && typeof data !== 'string') {
          setProfile({
            id: data.id,
            avatar: data.avatar || '',
            permission: data.permission,
            name: data.username
          })
        }
      })
    }
    const config = sessionStorage.getItem('config')
    if (config) {
      const configObj = JSON.parse(config)
      const configWrapper = new ConfigWrapper(configObj, defaultClientConfig)
      setConfig(configWrapper)
    } else {
      client.config({ type: "client" }).get().then(({ data }) => {
        if (data && typeof data !== 'string') {
          sessionStorage.setItem('config', JSON.stringify(data))
          const config = new ConfigWrapper(data, defaultClientConfig)
          setConfig(config)
        }
      })
    }
    ref.current = true
  }, [])

  const favicon = `${process.env.API_URL}/favicon`;

  return (
    <>
      <ClientConfigContext.Provider value={config}>
        <ProfileContext.Provider value={profile}>
          <Helmet>
            {favicon && <link rel="icon" href={favicon} />}
          </Helmet>
          <Switch>
            <RouteMe path="/"><FeedsPage /></RouteMe>
            <RouteMe path="/timeline"><TimelinePage /></RouteMe>
            <RouteMe path="/moments"><MomentsPage /></RouteMe>
            <RouteMe path="/friends"><FriendsPage /></RouteMe>
            <RouteMe path="/hashtags"><HashtagsPage /></RouteMe>
            <RouteMe path="/hashtag/:name">{params => <HashtagPage name={params.name || ""} />}</RouteMe>
            <RouteMe path="/search/:keyword">{params => <SearchPage keyword={params.keyword || ""} />}</RouteMe>
            <RouteMe path="/settings" requirePermission><Settings /></RouteMe>
            <RouteMe path="/writing" requirePermission><WritingPage /></RouteMe>
            <RouteMe path="/writing/:id" requirePermission>
              {({ id }) => <WritingPage id={tryInt(0, id)} />}
            </RouteMe>
            <RouteMe path="/callback"><CallbackPage /></RouteMe>
            <RouteWithIndex path="/feed/:id">
              {(params, TOC, clean) => <FeedPage id={params.id || ""} TOC={TOC} clean={clean} />}
            </RouteWithIndex>
            <RouteWithIndex path="/:alias">
              {(params, TOC, clean) => <FeedPage id={params.alias || ""} TOC={TOC} clean={clean} />}
            </RouteWithIndex>
            <RouteMe><ErrorPage error={t('error.not_found')} /></RouteMe>
          </Switch>
        </ProfileContext.Provider>
      </ClientConfigContext.Provider>
    </>
  )
}

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
      {params => (
        <div className="flex flex-col min-h-screen">
          <Header>{headerComponent}</Header>
          <Padding className={`${paddingClassName || ''} flex-1`}>
            {/* 布局容器：最大宽度 2200px，确保在大屏下能容纳三栏 */}
            <div className="flex flex-col lg:flex-row gap-8 xl:gap-10 py-8 w-full max-w-[2200px] items-start">
              
              {/* 左侧栏：固定 220px */}
              <aside className="w-full lg:w-[220px] flex-shrink-0 sticky top-24 z-10">
                <Sidebar />
              </aside>
              
              {/* 主内容区：使用 flex-1 占据中间所有空间 */}
              <main className="flex-1 min-w-0 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-neutral-100 rounded-[2.5rem] overflow-visible">
                {/* 增加右侧内边距，防止内容贴到目录上（如果是移动端则不加） */}
                <div className="w-full h-full p-6 md:p-10 lg:p-14 toc-content text-[1.05rem] leading-loose text-neutral-800 antialiased flex flex-col xl:flex-row gap-8">
                   {/* 这里通过 CSS 让 children 里的 TOC 自动去右边 */}
                  <div className="flex-1 min-w-0">
                    {typeof children === 'function' ? children(params) : children}
                  </div>
                </div>
              </main>
              
            </div>
          </Padding>
          <Footer />
        </div>
      )}
    </Route>
  )
}

function RouteWithIndex({ path, children }:
  { path: PathPattern, children: (params: DefaultParams, TOC: () => JSX.Element, clean: (id: string) => void) => React.ReactNode }) {
  const { TOC, cleanup } = useTableOfContents(".toc-content");
  return (
    <RouteMe path={path} headerComponent={TOCHeader({ TOC: TOC })} paddingClassName=''>
      {params => children(params, TOC, cleanup)}
    </RouteMe>
  )
}

export default App
