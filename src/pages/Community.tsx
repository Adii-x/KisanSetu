import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { mockPosts, CommunityPost } from '@/data/mockData';
import { toast } from 'sonner';

const communityCategories = ['all', 'crop', 'prices', 'schemes', 'tips'];

const CommunityPage = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
  const [filter, setFilter] = useState('all');
  const [newPost, setNewPost] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('crop');

  const filtered = filter === 'all' ? posts : posts.filter(p => p.category === filter);

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
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
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text mb-1">{t('community.title')}</h1>
        <p className="text-muted-foreground mb-6">{t('community.subtitle')}</p>

        {/* Create Post */}
        <div className="glass-card p-4 mb-6">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder={t('community.writePost')}
            className="w-full bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground min-h-[80px]"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <select
              value={newPostCategory}
              onChange={(e) => setNewPostCategory(e.target.value)}
              className="bg-muted/50 text-foreground text-sm px-3 py-1.5 rounded-lg border-none outline-none"
            >
              {communityCategories.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>{t(`community.categories.${c}`)}</option>
              ))}
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePost}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 btn-glow"
            >
              <Send className="h-4 w-4" />
              {t('community.post')}
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {communityCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-card text-foreground hover:bg-primary/5'
              }`}
            >
              {t(`community.categories.${cat}`)}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {post.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{post.author}</h4>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
                <span className="ml-auto text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary font-medium">
                  {t(`community.categories.${post.category}`)}
                </span>
              </div>
              <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>
              <div className="flex gap-6 text-muted-foreground">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${post.liked ? 'text-destructive' : 'hover:text-destructive'}`}
                >
                  <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors">
                  <Share2 className="h-4 w-4" />
                  {t('community.share')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CommunityPage;
