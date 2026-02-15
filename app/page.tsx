import Header from "@/components/Header";
import NewsFeed from "@/components/NewsFeed";
import Footer from "@/components/Footer";
import { fetchNews, Language } from "@/lib/api";
import { headers } from "next/headers";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Home(props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams;

  // Server-side language detection
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  const defaultLang = acceptLanguage?.startsWith('it') ? 'it' : 'en';

  const lang = (searchParams.lang as Language) || defaultLang;
  const news = await fetchNews(lang);

  return (
    <>
      <Header lang={lang} />
      <NewsFeed news={news} />
      <Footer />
    </>
  );
}
