import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { mockPosts, CommunityPost } from '@/data/mockData';
import { toast } from 'sonner';

const communityCategories = ['all', 'crop', 'prices', 'schemes', 'tips'];

const FarmerCommunityPage = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
  const [filter, setFilter] = useState('all');
  const [newPost, setNewPost] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('crop');

  const filtered = filter === 'all' ? posts : posts.filter(p => p.category === filter);

  const handleLike = (id: string) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: CommunityPost = {
      id: Date.now().toString(),
      author: 'You',
      avatar: 'YO',
      content: newPost,
      category: newPostCategory,
      likes: 0,
      comments: 0,
      time: 'Just now',
      liked: false,
    };
    setPosts(prev => [post, ...prev]);
    setNewPost('');
    toast.success(t('community.post') + '!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl space-y-8"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          {t('community.title')}
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">{t('community.subtitle')}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <textarea
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          placeholder={t('community.writePost')}
          className="w-full bg-muted/30 text-foreground px-4 py-3 rounded-xl border border-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 min-h-[88px] resize-none"
        />
        <div className="flex items-center justify-between mt-4">
          <select
            value={newPostCategory}
            onChange={e => setNewPostCategory(e.target.value)}
            className="bg-muted/50 text-foreground text-sm px-3 py-2 rounded-xl border border-border outline-none"
          >
            {communityCategories.filter(c => c !== 'all').map(c => (
              <option key={c} value={c}>{t(`community.categories.${c}`)}</option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePost}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <Send className="h-4 w-4" /> {t('community.post')}
          </motion.button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {communityCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {t(`community.categories.${cat}`)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-sm font-semibold text-primary">
                  {post.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.time} · {t(`community.categories.${post.category}`)}</p>
                  <p className="text-foreground mt-2">{post.content}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  post.liked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
                {post.likes}
              </button>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4" /> {post.comments}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FarmerCommunityPage;
