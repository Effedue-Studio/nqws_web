import { fetchNews, Language } from "@/lib/api";
import NewsFeed from "./NewsFeed";

interface AsyncNewsFeedProps {
    lang: Language;
}

export default async function AsyncNewsFeed({ lang }: AsyncNewsFeedProps) {
    const news = await fetchNews(lang);
    return <NewsFeed news={news} />;
}
