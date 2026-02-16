import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PullToRefresh from "@/components/PullToRefresh";
import { Language } from "@/lib/api";
import { headers } from "next/headers";
import { Suspense } from "react";
import AsyncNewsFeed from "@/components/AsyncNewsFeed";
import NewsSkeleton from "@/components/NewsSkeleton";

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

  return (
    <PullToRefresh>
      <Header lang={lang} />
      <Suspense fallback={<NewsSkeleton />}>
        <AsyncNewsFeed lang={lang} />
      </Suspense>
      <Footer />
    </PullToRefresh>
  );
}
