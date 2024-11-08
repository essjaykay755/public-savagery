"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Header } from "@/components/Header";
import { PlatformFilter } from "@/components/PlatformFilter";
import { SocialMediaCard } from "@/components/SocialMediaCard";
import { AddSavageryModal } from "@/components/AddSavageryModal";

type Platform = "Reddit" | "YouTube" | "Facebook" | "X" | "Instagram";

interface SocialMediaPost {
  id: string;
  platform: Platform;
  votes: number;
  timestamp: number;
  imageUrl: string;
  sourceLink?: string;
}

const POSTS_PER_PAGE = 12;

export default function Home() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [filter, setFilter] = useState<Platform | "All">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddSavageryOpen, setIsAddSavageryOpen] = useState(false);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [ref, inView] = useInView();

  const fetchPosts = async (isInitial = false) => {
    let q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(POSTS_PER_PAGE)
    );

    if (!isInitial && lastVisible) {
      q = query(
        collection(db, "posts"),
        orderBy("timestamp", "desc"),
        startAfter(lastVisible),
        limit(POSTS_PER_PAGE)
      );
    }

    const querySnapshot = await getDocs(q);
    const newPosts = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as SocialMediaPost)
    );

    if (isInitial) {
      setPosts(newPosts);
    } else {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    }

    if (querySnapshot.docs.length > 0) {
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, []);

  useEffect(() => {
    if (inView) {
      fetchPosts();
    }
  }, [inView]);

  const filteredPosts = posts
    .filter((post) => filter === "All" || post.platform === filter)
    .filter((post) =>
      post.platform.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleAddSavagery = () => {
    fetchPosts(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <Header
          onOpenAddSavagery={() => setIsAddSavageryOpen(true)}
          onSearch={handleSearch}
        />
        <PlatformFilter filter={filter} setFilter={setFilter} />
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosts.map((post) => (
              <SocialMediaCard key={post.id} post={post} />
            ))}
          </div>
          <div ref={ref} className="h-10" />
        </main>
      </div>
      <AddSavageryModal
        isOpen={isAddSavageryOpen}
        onClose={() => setIsAddSavageryOpen(false)}
        onSubmit={handleAddSavagery}
      />
    </div>
  );
}
