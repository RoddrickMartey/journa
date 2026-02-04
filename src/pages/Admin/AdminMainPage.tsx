"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Users,
  FolderOpen,
  Activity,
  FileText,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "@/lib/getCookie";
import { useAdminStore } from "@/store/adminStore";
import { useMemo } from "react";

interface CardItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
}

function AdminMainPage() {
  const { user } = useAdminStore();
  const supaAdminCookie = getCookie("supaAdmin");
  const isSuper = user?.id === supaAdminCookie;

  const cards = useMemo<CardItem[]>(() => {
    const baseCards: CardItem[] = [
      {
        id: "users",
        title: "Users",
        description: "View and manage all registered users",
        icon: <Users className="w-8 h-8" />,
        color:
          "from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30",
        path: "/admin",
      },
      {
        id: "categories",
        title: "Categories",
        description: "Create and manage post categories",
        icon: <FolderOpen className="w-8 h-8" />,
        color:
          "from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30",
        path: "/admin/categories",
      },
      {
        id: "logs",
        title: "Logs",
        description: "View system activity and audit logs",
        icon: <Activity className="w-8 h-8" />,
        color:
          "from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30",
        path: "/admin/logs",
      },
      {
        id: "posts",
        title: "Posts",
        description: "Manage all published posts and content",
        icon: <FileText className="w-8 h-8" />,
        color:
          "from-pink-500/20 to-pink-600/20 hover:from-pink-500/30 hover:to-pink-600/30",
        path: "/admin",
      },
    ];

    if (isSuper) {
      baseCards.push({
        id: "admin",
        title: "Admin",
        description: "Manage administrator accounts and permissions",
        icon: <Shield className="w-8 h-8" />,
        color:
          "from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30",
        path: "/admin/list",
      });
    }

    return baseCards;
  }, [isSuper]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const navaigate = useNavigate();

  return (
    <section className=" w-full p-4 sm:p-6 lg:p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your application and monitor activities
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              whileHover="hover"
              className={`bg-linear-to-br ${card.color} rounded-lg border border-border p-6 transition-all duration-300 cursor-pointer`}
            >
              <motion.div variants={hoverVariants}>
                <div className="flex flex-col h-full">
                  {/* Icon */}
                  <motion.div
                    className="mb-4 text-foreground/80 group-hover:text-foreground transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {card.icon}
                  </motion.div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    {card.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-6 grow">
                    {card.description}
                  </p>

                  {/* Button */}
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group"
                      onClick={() => navaigate(card.path)}
                    >
                      <span>View</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default AdminMainPage;
