import {Link} from "wouter";
import {useTranslation} from "react-i18next";
import {timeago} from "../utils/timeago";
import {HashTag} from "./hashtag";
import {useMemo} from "react";

export function FeedCard({ id, title, avatar, draft, listed, top, summary, hashtags, createdAt, updatedAt }:
    {
        id: string, avatar?: string,
        draft?: number, listed?: number, top?: number,
        title: string, summary: string,
        hashtags: { id: number, name: string }[],
        createdAt: Date, updatedAt: Date
    }) {
    const { t } = useTranslation()
    return useMemo(() => (
        <Link href={`/feed/${id}`} target="_blank" 
              className="block overflow-hidden rounded-3xl bg-card-light dark:bg-card-dark shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-neutral-200 dark:border-neutral-700">
            {avatar &&
                <div className="w-full h-72 overflow-hidden">
                    <img src={avatar} alt=""
                         className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>}
            <div className="p-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 line-clamp-2 hover:text-theme transition-colors">
                    {title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <span title={new Date(createdAt).toLocaleString()}>
                        {createdAt === updatedAt ? timeago(createdAt) : t('feed_card.published$time', { time: timeago(createdAt) })}
                    </span>
                    {createdAt !== updatedAt &&
                        <span title={new Date(updatedAt).toLocaleString()}>
                            {t('feed_card.updated$time', { time: timeago(updatedAt) })}
                        </span>}
                    {draft === 1 && <span className="px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400 rounded-full text-xs font-medium">{t("draft")}</span>}
                    {listed === 0 && <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">{t("unlisted")}</span>}
                    {top === 1 && <span className="px-3 py-1 bg-theme text-white rounded-full text-xs font-medium">
                        {t('article.top.title')}
                    </span>}
                </div>
                <div className="prose prose-base dark:prose-invert text-gray-700 dark:text-gray-300 line-clamp-5 mb-8 leading-relaxed">
                    {summary}
                </div>
                {hashtags.length > 0 &&
                    <div className="flex flex-wrap gap-3">
                        {hashtags.map(({ name }, index) => (
                            <HashTag key={index} name={name} />
                        ))}
                    </div>
                }
            </div>
        </Link>
    ), [id, title, avatar, draft, listed, top, summary, hashtags, createdAt, updatedAt])
}