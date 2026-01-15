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
import { Settings } from "./page/settings.tsx"
import { WritingPage } from './page/writing'
import { ClientConfigContext, ConfigWrapper, defaultClientConfig } from './state/config.tsx'
import { Profile, ProfileContext } from './state/profile'
import { headersWithAuth } from './utils/auth'
import { tryInt } from './utils/int'
import { SearchPage } from './page/search.tsx'
import { useTranslation } from 'react-i18next'
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
            <RouteMe path="/settings" requirePermission><Settings /></RouteMe>
            <RouteMe path="/writing" requirePermission><WritingPage /></RouteMe>
            <RouteMe path="/writing/:id" requirePermission>
              {({ id }) => <WritingPage id={tryInt(0, id)} />}
            </RouteMe>
            <RouteMe path="/callback"><CallbackPage /></RouteMe>
            <RouteMe path="/search/:keyword">{params => <SearchPage keyword={params.keyword || ""} />}</RouteMe>
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
      {(params: DefaultParams) => (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
          <Header>{headerComponent}</Header>
          <Padding className={`${paddingClassName || ''} flex-1`}>
            <div className="mx-auto max-w-7xl px-4 py-12 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <aside className="lg:col-span-3 sticky top-24 h-fit">
                  <Sidebar />
                </aside>
                <main className="lg:col-span-9">
                  <div className="bg-card-light dark:bg-card-dark rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
                    <div className="p-8 md:p-12 prose prose-lg max-w-none dark:prose-invert toc-content">
                      {typeof children === 'function' ? children(params) : children}
                    </div>
                  </div>
                </main>
              </div>
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
      {(params: DefaultParams) => children(params, TOC, cleanup)}
    </RouteMe>
  )
}

export default App
