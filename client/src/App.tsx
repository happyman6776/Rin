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
  // ... (原有 useEffect 等完全不变)

  return (
    <>
      {/* ... Provider 和 Switch 不变 */}
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

// RouteWithIndex 不变

export default App