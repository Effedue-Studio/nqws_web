"use client";

import { useState, useEffect } from "react";
import { NewsItem, Language } from "@/lib/api";
import styles from "./NewsFeed.module.css";

interface NewsFeedProps {
    news: NewsItem[];
    lang: Language;
}

interface SeenNews {
    id: string; // Using URL as ID
    timestamp: number;
}

export default function NewsFeed({ news, lang }: NewsFeedProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        // 1. Load existing seen news
        const stored = localStorage.getItem("seenNews");
        let seenNews: SeenNews[] = stored ? JSON.parse(stored) : [];

        // 2. Filter out expired (> 24h)
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        const validSeenNews = seenNews.filter(item => (now - item.timestamp) < oneDayMs);

        // 3. Update state with currently valid seen IDs (for rendering)
        setSeenIds(new Set(validSeenNews.map(item => item.id)));

        // 4. Update local storage if we filtered out expired items
        if (validSeenNews.length !== seenNews.length) {
            localStorage.setItem("seenNews", JSON.stringify(validSeenNews));
        }
    }, [news]);

    const toggleItem = (index: number) => {
        const isExpanding = expandedIndex !== index;
        setExpandedIndex(isExpanding ? index : null);

        if (isExpanding) {
            const item = news[index];
            // If satisfied, mark as seen
            if (!seenIds.has(item.url)) {
                const now = Date.now();
                const newSeenIds = new Set(seenIds);
                newSeenIds.add(item.url);
                setSeenIds(newSeenIds);

                // Update local storage
                const stored = localStorage.getItem("seenNews");
                const seenNews: SeenNews[] = stored ? JSON.parse(stored) : [];
                seenNews.push({ id: item.url, timestamp: now });
                localStorage.setItem("seenNews", JSON.stringify(seenNews));
            }
        }
    };

    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const isToday = date.getDate() === now.getDate() &&
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear();

            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');

            if (isToday) {
                const todayLabel = lang === "it" ? "Oggi" : "Today";
                return `${todayLabel} - ${hours}:${minutes}`;
            } else {
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                return `${day}/${month} - ${hours}:${minutes}`;
            }
        } catch (e) {
            return "";
        }
    };

    if (news.length === 0) {
        return (
            <div className={styles.feed}>
                <p className={styles.description}>No news in the last 24 hours.</p>
            </div>
        );
    }

    return (
        <div className={styles.feed}>
            {news.map((item, index) => {
                const isExpanded = expandedIndex === index;
                return (
                    <article key={index} className={styles.item}>
                        <button
                            className={styles.summary}
                            onClick={() => toggleItem(index)}
                            aria-expanded={isExpanded}
                            aria-controls={`content-${index}`}
                        >
                            <h2
                                className={styles.title}
                                style={{ opacity: seenIds.has(item.url) ? 0.6 : 1 }}
                            >
                                {item.title}
                            </h2>
                            <time className={styles.time} dateTime={item.date} suppressHydrationWarning>
                                {formatTime(item.date)}
                            </time>
                        </button>
                        <div
                            id={`content-${index}`}
                            className={`${styles.descriptionWrapper} ${isExpanded ? styles.expanded : ""
                                }`}
                            aria-hidden={!isExpanded}
                        >
                            <div className={styles.descriptionContent}>
                                <p className={styles.description}>{item.description}</p>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
