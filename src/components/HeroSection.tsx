import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Users,
  Sprout,
  BarChart3,
  Languages,
  ShoppingBag,
  Tractor,
  ShoppingCart,
  Truck,
  Mic,
  ShieldCheck,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-farm.png';

const HeroSection = () => {
  const { t } = useTranslation();

  const features = [
    { icon: ShoppingBag, title: t('features.directTrade'), desc: t('features.directTradeDesc') },
    { icon: Users, title: t('features.community'), desc: t('features.communityDesc') },
    { icon: BarChart3, title: t('features.analytics'), desc: t('features.analyticsDesc') },
    { icon: Languages, title: t('features.multilingual'), desc: t('features.multilingualDesc') },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-8 pb-16 md:pt-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
              <Sprout className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">KisanSetu</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 gradient-text">
              {t('hero.headline')}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              {t('hero.subtext')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/select-role?mode=signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold flex items-center gap-2 btn-glow"
                >
                  {t('hero.getStarted', 'Get Started')}
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
              <Link to="/marketplace">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-card px-6 py-3 rounded-xl font-semibold text-foreground flex items-center gap-2 hover:bg-primary/5 transition-colors"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {t('hero.explore')}
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="KisanSetu - Digital Agriculture"
                className="w-full h-auto object-cover float-animation"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text"
        >
          {t('features.title')}
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feat.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 1: How it works */}
      <section className="container mx-auto px-4 pb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-center mb-3 gradient-text"
        >
          {t('landing.how.title')}
        </motion.h2>
        <p className="text-center text-muted-foreground mb-10">
          {t('landing.how.subtitle')}
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Tractor,
              title: t('landing.how.step1.title'),
              desc: t('landing.how.step1.desc'),
            },
            {
              icon: ShoppingCart,
              title: t('landing.how.step2.title'),
              desc: t('landing.how.step2.desc'),
            },
            {
              icon: Truck,
              title: t('landing.how.step3.title'),
              desc: t('landing.how.step3.desc'),
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-semibold text-primary">
                  {index + 1}
                </div>
              </div>
              <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Why choose us */}
      <section className="container mx-auto px-4 pb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-center mb-10 gradient-text"
        >
          {t('landing.why.title')}
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { title: t('landing.why.card1.title'), desc: t('landing.why.card1.desc') },
            { title: t('landing.why.card2.title'), desc: t('landing.why.card2.desc') },
            { title: t('landing.why.card3.title'), desc: t('landing.why.card3.desc') },
            { title: t('landing.why.card4.title'), desc: t('landing.why.card4.desc') },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-card p-5 flex flex-col gap-2"
            >
              <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Feature highlight split */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl overflow-hidden min-h-[260px] bg-gradient-to-tr from-primary/10 to-primary/5"
          >
            <img
              src={heroImage}
              alt="KisanSetu agriculture illustration"
              className="w-full h-full object-cover mix-blend-multiply"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-2xl md:text-3xl font-bold gradient-text">
              {t('landing.split.title')}
            </h2>
            <ul className="space-y-2">
              {[
                'marketplace',
                'analytics',
                'community',
                'voice',
                'checkout',
                'delivery',
              ].map((itemKey, index) => (
                <motion.li
                  key={itemKey}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{t(`landing.split.${itemKey}`)}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: Community preview */}
      <section className="container mx-auto px-4 pb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-center mb-8 gradient-text"
        >
          {t('landing.communityPreview.title')}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            t('landing.communityPreview.post1'),
            t('landing.communityPreview.post2'),
            t('landing.communityPreview.post3'),
          ].map(post => (
            <div key={post} className="glass-card p-4 flex flex-col gap-3 text-sm">
              <p className="text-foreground">{post}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <button className="inline-flex items-center gap-1 hover:text-primary">
                  <span>👍</span>
                  <span>{t('community.like')}</span>
                </button>
                <button className="inline-flex items-center gap-1 hover:text-primary">
                  <span>💬</span>
                  <span>{t('community.comment')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Live market preview removed from landing */}

      {/* SECTION 6: Testimonials */}
      <section className="container mx-auto px-4 pb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-center mb-8 gradient-text"
        >
          {t('landing.testimonials.title')}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(index => (
            <div key={index} className="glass-card p-5 flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/40 to-primary/10" />
                <div>
                  <p className="font-semibold text-foreground">
                    {t(`landing.testimonials.person${index}.name`)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {t(`landing.testimonials.person${index}.quote`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: Final CTA */}
      <section className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">
            {t('landing.finalCta.title')}
          </h2>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            <Link to="/select-role?mode=signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold btn-glow"
              >
                {t('landing.finalCta.farmer')}
              </motion.button>
            </Link>
            <Link to="/marketplace">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card px-6 py-3 rounded-xl font-semibold text-foreground"
              >
                {t('landing.finalCta.buyer')}
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 8: Footer */}
      <footer className="glass-navbar mt-0">
        <div className="container mx-auto px-4 py-6 grid md:grid-cols-4 gap-6 text-xs text-muted-foreground">
          <div>
            <p className="font-semibold mb-2 text-foreground">KisanSetu</p>
            <p>{t('landing.footer.tagline')}</p>
          </div>
          <div>
            <p className="font-semibold mb-2 text-foreground">{t('landing.footer.quickLinks')}</p>
            <div className="space-y-1">
              <Link to="/marketplace" className="block hover:text-primary">
                {t('nav.marketplace')}
              </Link>
              <Link to="/community" className="block hover:text-primary">
                {t('nav.community')}
              </Link>
              <Link to="/analytics" className="block hover:text-primary">
                {t('nav.analytics')}
              </Link>
            </div>
          </div>
          <div>
            <p className="font-semibold mb-2 text-foreground">{t('landing.footer.contact')}</p>
            <p>support@smartkrishi.com</p>
            <p>+91-8000-000-000</p>
          </div>
          <div>
            <p className="font-semibold mb-2 text-foreground">{t('landing.footer.follow')}</p>
            <div className="flex gap-3 mb-2">
              <span>🌐</span>
              <span>📘</span>
              <span>📸</span>
            </div>
            <p className="text-[11px]">{t('landing.footer.languageHint')}</p>
          </div>
        </div>
        <div className="border-t border-primary/10 py-3 text-center text-[11px] text-muted-foreground">
          {t('landing.footer.copy')}
        </div>
      </footer>
    </div>
  );
};

export default HeroSection;
