import {useContext, useEffect, useRef, useState} from "react";
import {Helmet} from "react-helmet";
import {useTranslation} from "react-i18next";
import ReactModal from "react-modal";
import Popup from "reactjs-popup";
import {Link, useLocation} from "wouter";
import {useAlert, useConfirm} from "../components/dialog";
import {HashTag} from "../components/hashtag";
import {Waiting} from "../components/loading";
import {Markdown} from "../components/markdown";
import {client} from "../main";
import {ClientConfigContext} from "../state/config";
import {ProfileContext} from "../state/profile";
import {headersWithAuth} from "../utils/auth";
import {siteName} from "../utils/constants";
import {timeago} from "../utils/timeago";
import {Button} from "../components/button";
import {Tips} from "../components/tips";
import {useLoginModal} from "../hooks/useLoginModal";
import mermaid from "mermaid";
import {AdjacentSection} from "../components/adjacent_feed.tsx";

type Feed = {
  id: number;
  title: string | null;
  content: string;
  uid: number;
  createdAt: Date;
  updatedAt: Date;
  hashtags: {
    id: number;
    name: string;
  }[];
  user: {
    avatar: string | null;
    id: number;
    username: string;
  };
  pv: number;
  uv: number;
};

export function FeedPage({ id, TOC, clean }: { id: string, TOC: () => JSX.Element, clean: (id: string) => void }) {
  const { t } = useTranslation();
  const profile = useContext(ProfileContext);
  const [feed, setFeed] = useState<Feed>();
  const [error, setError] = useState<string>();
  const [headImage, setHeadImage] = useState<string>();
  const ref = useRef("");
  const [, setLocation] = useLocation();
  const { showAlert, AlertUI } = useAlert();
  const { showConfirm, ConfirmUI } = useConfirm();
  const [top, setTop] = useState<number>(0);
  const config = useContext(ClientConfigContext);
  const counterEnabled = config.get<boolean>('counter.enabled');

  function deleteFeed() {
    showConfirm(
      t("article.delete.title"),
      t("article.delete.confirm"),
      () => {
        if (!feed) return;
        client
          .feed({ id: feed.id })
          .delete(null, {
            headers: headersWithAuth(),
          })
          .then(({ error }) => {
            if (error) {
              showAlert(error.value as string);
            } else {
              showAlert(t("delete.success"));
              setLocation("/");
            }
          });
      })
  }

  function topFeed() {
    const isUnTop = !(top > 0)
    const topNew = isUnTop ? 1 : 0;
    showConfirm(
      isUnTop ? t("article.top.title") : t("article.untop.title"),
      isUnTop ? t("article.top.confirm") : t("article.untop.confirm"),
      () => {
        if (!feed) return;
        client
          .feed.top({ id: feed.id })
          .post({
            top: topNew,
          }, {
            headers: headersWithAuth(),
          })
          .then(({ error }) => {
            if (error) {
              showAlert(error.value as string);
            } else {
              showAlert(isUnTop ? t("article.top.success") : t("article.untop.success"));
              setTop(topNew);
            }
          });
      })
  }

  useEffect(() => {
    if (ref.current == id) return;
    setFeed(undefined);
    setError(undefined);
    setHeadImage(undefined);
    client
      .feed({ id })
      .get({
        headers: headersWithAuth(),
      })
      .then(({ data, error }) => {
        if (error) {
          setError(error.value as string);
        } else if (data && typeof data !== "string") {
          setTimeout(() => {
            setFeed(data);
            setTop(data.top);
            const img_reg = /!\[.*?\]\((.*?)\)/;
            const img_match = img_reg.exec(data.content);
            if (img_match) {
              setHeadImage(img_match[1]);
            }
            clean(id);
          }, 0);
        }
      });
    ref.current = id;
  }, [id]);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
    });
    mermaid.run({
      suppressErrors: true,
      nodes: document.querySelectorAll("pre.mermaid_default")
    }).then(()=>{
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
      });
      mermaid.run({
        suppressErrors: true,
        nodes: document.querySelectorAll("pre.mermaid_dark")
      });
    })
  }, [feed]);

  return (
    <Waiting for={feed || error}>
      {feed && (
        <Helmet>
          <title>{`${feed.title ?? "Unnamed"} - ${process.env.NAME}`}</title>
          <meta property="og:site_name" content={siteName} />
          <meta property="og:title" content={feed.title ?? ""} />
          <meta property="og:image" content={headImage ?? process.env.AVATAR} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={document.URL} />
          <meta
            name="og:description"
            content={
              feed.content.length > 200
                ? feed.content.substring(0, 200)
                : feed.content
            }
          />
          <meta name="author" content={feed.user.username} />
          <meta
            name="keywords"
            content={feed.hashtags.map(({ name }) => name).join(", ")}
          />
          <meta
            name="description"
            content={
              feed.content.length > 200
                ? feed.content.substring(0, 200)
                : feed.content
            }
          />
        </Helmet>
      )}
      <div className="w-full">
        {error && (
          <>
            <div className="flex flex-col wauto rounded-2xl bg-w m-2 p-6 items-center justify-center space-y-2">
              <h1 className="text-xl font-bold t-primary">{error}</h1>
              {error === "Not found" && id === "about" && (
                <Tips value={t("about.notfound")} />
              )}
              <Button
                title={t("index.back")}
                onClick={() => (window.location.href = "/")}
              />
            </div>
          </>
        )}
        {feed && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-9 space-y-12">
              <article className="bg-card-light dark:bg-card-dark rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
                <div className="p-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                        <span title={new Date(feed.createdAt).toLocaleString()}>
                          {t("feed_card.published$time", { time: timeago(feed.createdAt) })}
                        </span>
                        {feed.createdAt !== feed.updatedAt && (
                          <span title={new Date(feed.updatedAt).toLocaleString()}>
                            {t("feed_card.updated$time", { time: timeago(feed.updatedAt) })}
                          </span>
                        )}
                        {counterEnabled && (
                          <span>
                            {t("count.pv")} {feed.pv} | {t("count.uv")} {feed.uv}
                          </span>
                        )}
                      </div>
                      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                        {feed.title}
                      </h1>
                    </div>
                    {profile?.permission && (
                      <div className="flex gap-3 ml-4">
                        <button
                          aria-label={top > 0 ? t("untop.title") : t("top.title")}
                          onClick={topFeed}
                          className={`p-3 rounded-full transition ${top > 0 ? "bg-theme text-white hover:bg-theme-hover" : "bg-gray-200 dark:bg-gray-700"}`}
                        >
                          <i className="ri-skip-up-line text-xl" />
                        </button>
                        <Link
                          aria-label={t("edit")}
                          href={`/writing/${feed.id}`}
                          className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full transition hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          <i className="ri-edit-2-line text-xl" />
                        </Link>
                        <button
                          aria-label={t("delete.title")}
                          onClick={deleteFeed}
                          className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full transition hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                          <i className="ri-delete-bin-7-line text-xl text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                  <Markdown content={feed.content} />
                  <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700">
                    {feed.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-8">
                        {feed.hashtags.map(({ name }, index) => (
                          <HashTag key={index} name={name} />
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <img
                        src={feed.user.avatar || "/avatar.png"}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{feed.user.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('author')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <AdjacentSection id={id} setError={setError}/>

              {config.get<boolean>('comment.enabled') && <Comments id={`${feed.id}`} />}
            </div>

            <div className="lg:col-span-3 hidden lg:block sticky top-24 h-fit">
              <div className="bg-card-light dark:bg-card-dark rounded-3xl p-6 shadow-xl">
                <TOC />
              </div>
            </div>
          </div>
        )}
      </div>
      <AlertUI />
      <ConfirmUI />
    </Waiting>
  );
}

export function TOCHeader({ TOC }: { TOC: () => JSX.Element }) {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpened(true)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-theme text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-theme-hover transition"
      >
        <i className="ri-menu-2-fill ri-lg"></i>
      </button>
      <ReactModal
        isOpen={isOpened}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "0",
            border: "none",
            borderRadius: "24px",
            background: "none",
            maxWidth: "90vw",
            maxHeight: "90vh",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1000,
          },
        }}
        onRequestClose={() => setIsOpened(false)}
      >
        <div className="bg-card-light dark:bg-card-dark rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[80vh]">
          <TOC />
        </div>
      </ReactModal>
    </div>
  );
}

function CommentInput({
  id,
  onRefresh,
}: {
  id: string;
  onRefresh: () => void;
}) {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { showAlert, AlertUI } = useAlert();
  const profile = useContext(ProfileContext);
  const { LoginModal, setIsOpened } = useLoginModal()

  function errorHumanize(error: string) {
    if (error === "Unauthorized") return t("login.required");
    else if (error === "Content is required") return t("comment.empty");
    return error;
  }

  function submit() {
    if (!profile) {
      setIsOpened(true)
      return;
    }
    client.feed
      .comment({ feed: id })
      .post(
        { content },
        {
          headers: headersWithAuth(),
        }
      )
      .then(({ error }) => {
        if (error) {
          setError(errorHumanize(error.value as string));
        } else {
          setContent("");
          setError("");
          showAlert(t("comment.success"), () => {
            onRefresh();
          });
        }
      });
  }

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-3xl p-8 shadow-xl">
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{t("comment.title")}</h3>
      {profile ? (
        <>
          <textarea
            id="comment"
            placeholder={t("comment.placeholder.title")}
            className="w-full h-32 px-6 py-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-gray-800 resize-none focus:ring-4 focus:ring-theme/20 transition"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="mt-6 text-right">
            <button
              className="px-8 py-3 bg-theme text-white rounded-full shadow-lg hover:shadow-xl hover:bg-theme-hover transition"
              onClick={submit}
            >
              {t("comment.submit")}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <button
            className="px-8 py-4 bg-theme text-white rounded-full shadow-lg hover:shadow-xl hover:bg-theme-hover transition"
            onClick={() => setIsOpened(true)}
          >
            {t("login.required")}
          </button>
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      <AlertUI />
      <LoginModal />
    </div>
  );
}

type Comment = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    username: string;
    avatar: string | null;
    permission: number | null;
  };
};

function Comments({ id }: { id: string }) {
  const config = useContext(ClientConfigContext);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string>();
  const ref = useRef("");
  const { t } = useTranslation();

  function loadComments() {
    client.feed
      .comment({ feed: id })
      .get({
        headers: headersWithAuth(),
      })
      .then(({ data, error }) => {
        if (error) {
          setError(error.value as string);
        } else if (data && Array.isArray(data)) {
          setComments(data);
        }
      });
  }

  useEffect(() => {
    if (ref.current == id) return;
    loadComments();
    ref.current = id;
  }, [id]);

  return (
    <>
      {config.get<boolean>('comment.enabled') &&
        <div className="space-y-12">
          <CommentInput id={id} onRefresh={loadComments} />
          {error && (
            <div className="text-center">
              <p className="text-xl font-bold text-red-500 mb-4">{error}</p>
              <button
                className="px-8 py-3 bg-theme text-white rounded-full shadow-lg hover:bg-theme-hover transition"
                onClick={loadComments}
              >
                {t("reload")}
              </button>
            </div>
          )}
          {comments.length > 0 && (
            <div className="space-y-8">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onRefresh={loadComments}
                />
              ))}
            </div>
          )}
        </div>
      }
    </>
  );
}

function CommentItem({
  comment,
  onRefresh,
}: {
  comment: Comment;
  onRefresh: () => void;
}) {
  const { showConfirm, ConfirmUI } = useConfirm();
  const { showAlert, AlertUI } = useAlert();
  const { t } = useTranslation();
  const profile = useContext(ProfileContext);

  function deleteComment() {
    showConfirm(
      t("delete.comment.title"),
      t("delete.comment.confirm"),
      async () => {
        client
          .comment({ id: comment.id })
          .delete(null, {
            headers: headersWithAuth(),
          })
          .then(({ error }) => {
            if (error) {
              showAlert(error.value as string);
            } else {
              showAlert(t("delete.success"), () => {
                onRefresh();
              });
            }
          });
      })
  }

  return (
    <div className="flex gap-6 animate-fade-in">
      <img
        src={comment.user.avatar || "/avatar.png"}
        className="w-12 h-12 rounded-full flex-shrink-0 ring-4 ring-white dark:ring-gray-800"
      />
      <div className="flex-1 bg-card-light dark:bg-card-dark rounded-3xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-gray-900 dark:text-white">
            {comment.user.username}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {timeago(comment.createdAt)}
          </span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>
        {(profile?.permission || profile?.id == comment.user.id) && (
          <div className="mt-4 text-right">
            <Popup
              arrow={false}
              trigger={
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  <i className="ri-more-fill text-gray-500" />
                </button>
              }
              position="left center"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2">
                <button
                  onClick={deleteComment}
                  className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                >
                  <i className="ri-delete-bin-2-line mr-2" />
                  {t("delete.comment.title")}
                </button>
              </div>
            </Popup>
          </div>
        )}
      </div>
      <ConfirmUI />
      <AlertUI />
    </div>
  );
}