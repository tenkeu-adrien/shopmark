import { FaArrowRight, FaCalendarAlt, FaClock } from 'react-icons/fa';
import Image from 'next/image';

const BlogSection = () => {
  // Exemple de données d'articles
  const blogArticles = [
    {
      id: 1,
      title: "Les tendances React en 2023",
      excerpt: "Découvrez les nouvelles fonctionnalités de React 18 et comment les implémenter dans vos projets.",
      date: "15 Mars 2023",
      readTime: "5 min",
      category: "Développement",
      image: "/6.jpg"
    },
    {
      id: 2,
      title: "Optimisation des performances web",
      excerpt: "Nos techniques avancées pour réduire le temps de chargement de vos applications.",
      date: "28 Février 2023",
      readTime: "8 min",
      category: "Performance",
      image: "/5.jpg"
    },
    {
      id: 3,
      title: "UX Design pour applications SaaS",
      excerpt: "Comment concevoir des interfaces qui boostent l'engagement utilisateur.",
      date: "10 Février 2023",
      readTime: "6 min",
      category: "Design",
      image: "/3.jpg"
    }
  ];

  return (
    <section className="relative w-full py-20 overflow-hidden bg-fixed bg-center bg-cover" style={{ backgroundImage: "url('/6.jpg')" }}>
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Nos Derniers Articles
      </h2>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto">
        Plongez dans notre expertise à travers des analyses techniques et des guides pratiques.
      </p>
    </div>

    {/* Grille d'articles */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogArticles.map((article) => (
        <article 
          key={article.id}
          className="bg-white bg-opacity-10 rounded-xl overflow-hidden backdrop-blur-sm border border-white border-opacity-20 hover:border-opacity-40 transition-all duration-300 hover:-translate-y-2"
        >
          <div className="relative h-48 w-full">
            <Image
              src={article.image}
              alt={article.title}
              layout="fill"
              objectFit="cover"
              className="filter brightness-90"
            />
            <div className="absolute top-4 right-4 bg-orange-500 text-white text-sm px-3 py-1 rounded-full">
              {article.category}
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center text-sm text-gray-300 mb-3">
              <span className="flex items-center mr-4">
                <FaCalendarAlt className="mr-2 text-orange-400" />
                {article.date}
              </span>
              <span className="flex items-center">
                <FaClock className="mr-2 text-orange-400" />
                {article.readTime}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text mb-3">
              {article.title}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {article.excerpt}
            </p>
            
            <a 
              href={`/blog/${article.id}`} 
              className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors"
            >
              Lire l'article <FaArrowRight className="ml-2" />
            </a>
          </div>
        </article>
      ))}
    </div>

    {/* Bouton "Voir plus" */}
    <div className="text-center mt-16">
      <a 
        href="/blog" 
        className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors"
      >
        Voir tous les articles
      </a>
    </div>
  </div>
</section>

  );
};

export default BlogSection;