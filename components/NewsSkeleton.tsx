import styles from "./NewsSkeleton.module.css";

export default function NewsSkeleton() {
    // Create an array of 6 items to mimic the feed
    const items = Array.from({ length: 12 });

    return (
        <div className={styles.skeletonContainer}>
            {items.map((_, index) => (
                <div key={index} className={styles.skeletonItem}>
                    <div
                        className={styles.skeletonTitle}
                        style={{ width: `${60 + (index % 4) * 10}%` }}
                    />
                    <div className={styles.skeletonTime} />
                </div>
            ))}
        </div>
    );
}
